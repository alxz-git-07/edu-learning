from datetime import datetime, date

from flask import current_app, request
from flask_bcrypt import Bcrypt
from flask_restful import Resource, abort
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

from models import (
    Assignment,
    AssignmentSubmission,
    Course,
    CourseEnrollment,
    Lesson,
    User,
    UserProfile,
    db,
)
from schema import (
    assignment_schema,
    assignment_submission_schema,
    assignments_schema,
    course_schema,
    courses_schema,
    lesson_schema,
    lessons_schema,
    user_schema,
)

bcrypt = Bcrypt()


def get_token_serializer():
    return URLSafeTimedSerializer(current_app.config["SECRET_KEY"], salt="auth-token")


def generate_token(user_id):
    return get_token_serializer().dumps({"user_id": user_id})


def verify_token(token, max_age=None):
    try:
        serializer = get_token_serializer()
        payload = serializer.loads(token, max_age=max_age)
        return payload.get("user_id")
    except SignatureExpired:
        abort(401, message="Token has expired")
    except BadSignature:
        return None


def get_current_user():
    authorization = request.headers.get("Authorization", "")
    if not authorization.startswith("Bearer "):
        return None

    token = authorization.split(" ", 1)[1].strip()
    user_id = verify_token(
        token, max_age=current_app.config.get("TOKEN_EXPIRATION", 86400)
    )
    if not user_id:
        return None

    return User.query.get(user_id)


def require_auth():
    user = get_current_user()
    if not user:
        abort(401, message="Authentication required")
    return user


def parse_iso_date(value):
    if not value:
        return None
    if isinstance(value, date):
        return value
    try:
        return datetime.fromisoformat(value).date()
    except ValueError:
        abort(400, message="Invalid date format. Use YYYY-MM-DD.")


class AuthRegister(Resource):
    def post(self):
        data = request.get_json(silent=True) or {}
        email = (data.get("email") or "").strip().lower()
        password = data.get("password")
        full_name = (
            data.get("full_name") or data.get("fullName") or data.get("username") or ""
        ).strip()
        role = data.get("role", "student")

        if not email or not password or not full_name:
            abort(400, message="Email, password, and full name are required.")

        if len(password) < 6:
            abort(400, message="Password must be at least 6 characters long.")

        if User.query.filter_by(email=email).first():
            abort(400, message="Email already registered.")

        user = User(
            email=email,
            password=bcrypt.generate_password_hash(password).decode("utf-8"),
            full_name=full_name,
            role=role,
            is_active=True,
        )
        db.session.add(user)
        db.session.flush()

        profile = UserProfile(
            user_id=user.id,
            bio=data.get("bio"),
            experience_level=data.get("cooking_level") or data.get("experience_level"),
            phone=data.get("phone"),
            dob=parse_iso_date(data.get("dob")),
        )
        db.session.add(profile)
        db.session.commit()

        return {
            "message": "User registered successfully.",
            "user": user_schema.dump(user),
        }, 201


class AuthLogin(Resource):
    def post(self):
        data = request.get_json(silent=True) or {}
        email = (data.get("email") or "").strip().lower()
        password = data.get("password")

        if not email or not password:
            abort(400, message="Email and password are required.")

        user = User.query.filter_by(email=email).first()
        if not user or not bcrypt.check_password_hash(user.password, password):
            abort(401, message="Invalid email or password.")

        if not user.is_active:
            abort(403, message="User account is inactive.")

        return {
            "access_token": generate_token(user.id),
            "user": user_schema.dump(user),
        }


class AuthMe(Resource):
    def get(self):
        user = get_current_user()
        if not user:
            abort(401, message="Invalid or missing authorization token.")

        return user_schema.dump(user)

    def patch(self):
        user = require_auth()
        data = request.get_json(silent=True) or {}

        if "full_name" in data:
            full_name = (data.get("full_name") or "").strip()
            if not full_name:
                abort(400, message="Full name cannot be empty.")
            user.full_name = full_name

        profile = user.profile
        if not profile:
            profile = UserProfile(user_id=user.id)
            db.session.add(profile)

        allowed_levels = {"beginner", "intermediate", "expert"}

        if "bio" in data:
            profile.bio = data.get("bio")
        if "experience_level" in data:
            level = data.get("experience_level")
            if level is not None and level not in allowed_levels:
                abort(
                    400,
                    message="Experience level must be beginner, intermediate, or expert.",
                )
            profile.experience_level = level or None
        if "phone" in data:
            profile.phone = data.get("phone")
        if "dob" in data:
            profile.dob = parse_iso_date(data.get("dob"))

        db.session.commit()
        return user_schema.dump(user)


class PasswordReset(Resource):
    def post(self):
        data = request.get_json(silent=True) or {}
        email = (data.get("email") or "").strip().lower()

        if not email:
            abort(400, message="Email is required.")

        # In a production app, this would send a secure reset email.
        exists = User.query.filter_by(email=email).first() is not None
        if exists:
            current_app.logger.info("Password reset requested for %s", email)

        return {"message": "If that email exists, a password reset link has been sent."}


class CoursesResource(Resource):
    def get(self):
        courses = (
            Course.query.filter_by(is_published=True)
            .order_by(Course.created_at.desc())
            .all()
        )
        return courses_schema.dump(courses)

    def post(self):
        user = require_auth()
        if user.role not in ("instructor", "admin"):
            abort(403, message="Only instructors and admins can create courses.")

        data = request.get_json(silent=True) or {}
        title = data.get("title")
        description = data.get("description")
        level = data.get("level")
        is_published = bool(data.get("is_published", False))

        if not title or not description:
            abort(400, message="Course title and description are required.")

        course = Course(
            title=title,
            description=description,
            tm_id=user.id,
            level=level,
            is_published=is_published,
        )
        db.session.add(course)
        db.session.commit()

        return course_schema.dump(course), 201


class CourseDetailResource(Resource):
    def get(self, course_id):
        course = Course.query.get_or_404(course_id)
        if not course.is_published:
            current_user = get_current_user()
            if not current_user or current_user.id != course.tm_id:
                abort(404, message="Course not found.")

        return course_schema.dump(course)


class CourseLessonsResource(Resource):
    def get(self, course_id):
        course = Course.query.get_or_404(course_id)
        lessons = (
            Lesson.query.filter_by(course_id=course.id, is_published=True)
            .order_by(Lesson.created_at)
            .all()
        )
        return lessons_schema.dump(lessons)


class CourseAssignmentsResource(Resource):
    def get(self, course_id):
        course = Course.query.get_or_404(course_id)
        assignments = (
            Assignment.query.filter_by(course_id=course.id)
            .order_by(Assignment.due_date)
            .all()
        )
        return assignments_schema.dump(assignments)


class CourseEnrollResource(Resource):
    def post(self, course_id):
        user = require_auth()
        course = Course.query.get_or_404(course_id)

        if CourseEnrollment.query.filter_by(
            student_id=user.id, course_id=course.id
        ).first():
            abort(400, message="Student is already enrolled in this course.")

        enrollment = CourseEnrollment(
            student_id=user.id, course_id=course.id, status="enrolled"
        )
        db.session.add(enrollment)
        db.session.commit()

        return {
            "message": "Enrollment successful.",
            "course": course_schema.dump(course),
        }, 201


class MyCoursesResource(Resource):
    def get(self):
        user = require_auth()
        enrolled_courses = [enrollment.course for enrollment in user.enrollments]
        taught_courses = (
            user.taught_courses if user.role in ("instructor", "admin") else []
        )

        return {
            "enrolled_courses": courses_schema.dump(enrolled_courses),
            "taught_courses": courses_schema.dump(taught_courses),
        }


class AssignmentResource(Resource):
    def get(self, assignment_id):
        assignment = Assignment.query.get_or_404(assignment_id)
        return assignment_schema.dump(assignment)


class AssignmentSubmitResource(Resource):
    def post(self, assignment_id):
        user = require_auth()
        assignment = Assignment.query.get_or_404(assignment_id)

        if AssignmentSubmission.query.filter_by(
            assignment_id=assignment.id, student_id=user.id
        ).first():
            abort(400, message="You have already submitted this assignment.")

        data = request.get_json(silent=True) or {}
        submission_text = data.get("submission")
        if not submission_text:
            abort(400, message="Submission text is required.")

        submission = AssignmentSubmission(
            assignment_id=assignment.id,
            student_id=user.id,
            submission=submission_text,
            submitted_at=datetime.now(datetime.timezone.utc),
            status="submitted",
        )
        db.session.add(submission)
        db.session.commit()

        return assignment_submission_schema.dump(submission), 201


def register_api_resources(api):
    api.add_resource(AuthRegister, "/auth/register")
    api.add_resource(AuthLogin, "/auth/login")
    api.add_resource(AuthMe, "/auth/me")
    api.add_resource(PasswordReset, "/auth/reset-password")
    api.add_resource(CoursesResource, "/courses")
    api.add_resource(CourseDetailResource, "/courses/<int:course_id>")
    api.add_resource(CourseLessonsResource, "/courses/<int:course_id>/lessons")
    api.add_resource(CourseAssignmentsResource, "/courses/<int:course_id>/assignments")
    api.add_resource(CourseEnrollResource, "/courses/<int:course_id>/enroll")
    api.add_resource(MyCoursesResource, "/my-courses")
    api.add_resource(AssignmentResource, "/assignments/<int:assignment_id>")
    api.add_resource(
        AssignmentSubmitResource, "/assignments/<int:assignment_id>/submit"
    )
