
from datetime import datetime, date, timedelta

from app import app
from models import (
    db,
    User,
    UserProfile,
    Course,
    CourseEnrollment,
    Lesson,
    Assignment,
    AssignmentSubmission,
    CourseLesson,
)

def get_or_create_user(email, password, full_name, role, is_active=True):
    user = User.query.filter_by(email=email).first()
    if user:
        return user

    user = User(
        email=email,
        password=password,
        full_name=full_name,
        role=role,
        is_active=is_active,
    )
    db.session.add(user)
    db.session.flush()
    return user

def get_or_create_profile(user, bio, experience_level, phone, dob):
    profile = UserProfile.query.filter_by(user_id=user.id).first()
    if profile:
        return profile

    profile = UserProfile(
        user_id=user.id,
        bio=bio,
        experience_level=experience_level,
        phone=phone,
        dob=dob,
    )
    db.session.add(profile)
    return profile

def get_or_create_course(title, description, tm_user, level="beginner", is_published=True):
    course = Course.query.filter_by(title=title).first()
    if course:
        return course

    course = Course(
        title=title,
        description=description,
        tm_id=tm_user.id,
        level=level,
        is_published=is_published,
    )
    db.session.add(course)
    db.session.flush()
    return course

with app.app_context():
    db.create_all()

    admin = get_or_create_user(
        "admin@example.com",
        "admin123",
        "Admin User",
        "admin",
        True,
    )
    instructor = get_or_create_user(
        "instructor@example.com",
        "instructor123",
        "Alice Johnson",
        "instructor",
        True,
    )
    student = get_or_create_user(
        "student@example.com",
        "student123",
        "Bob Smith",
        "student",
        True,
    )

    get_or_create_profile(
        instructor,
        "Senior instructor with 10+ years of experience.",
        "expert",
        "1234567890",
        date(1990, 5, 15),
    )

    course = get_or_create_course(
        "Python Basics",
        "An introductory course for learning Python programming.",
        instructor,
        "beginner",
        True,
    )

    lesson = Lesson.query.filter_by(course_id=course.id, title="Introduction to Variables").first()
    if not lesson:
        lesson = Lesson(
            course=course,
            title="Introduction to Variables",
            content="Learn how variables store values in Python.",
            duration_minutes=30,
            is_published=True,
        )
        db.session.add(lesson)
        db.session.flush()

    assignment = Assignment.query.filter_by(course_id=course.id, title="Python Quiz").first()
    if not assignment:
        assignment = Assignment(
            course=course,
            title="Python Quiz",
            description="A short quiz covering Python basics.",
            instructions="Answer all questions and submit your responses.",
            due_date=datetime.now() + timedelta(days=7),
        )
        db.session.add(assignment)
        db.session.flush()

    enrollment = CourseEnrollment.query.filter_by(student_id=student.id, course_id=course.id).first()
    if not enrollment:
        enrollment = CourseEnrollment(
            student_id=student.id,
            course=course,
            status="enrolled",
        )
        db.session.add(enrollment)

    submission = AssignmentSubmission.query.filter_by(
        assignment_id=assignment.id,
        student_id=student.id,
    ).first()
    if not submission:
        submission = AssignmentSubmission(
            assignment=assignment,
            student=student,
            submission="Completed the quiz successfully.",
            submitted_at=datetime.now(),
            status="submitted",
            score=90,
            graded_by=instructor.id,
            graded_at=datetime.now(),
        )
        db.session.add(submission)

    course_lesson = CourseLesson.query.filter_by(course_id=course.id, lesson_id=lesson.id).first()
    if not course_lesson:
        course_lesson = CourseLesson(
            lesson=lesson,
            course=course,
            title=lesson.title,
            description="A linked lesson entry for the course.",
        )
        db.session.add(course_lesson)

    # Add 5 additional sample users and profiles
    extra_users = [
        ("maria@example.com", "maria123", "Maria Lopez", "student"),
        ("james@example.com", "james123", "James Carter", "student"),
        ("sofia@example.com", "sofia123", "Sofia Nguyen", "student"),
        ("david@example.com", "david123", "David Kim", "student"),
        ("nina@example.com", "nina123", "Nina Patel", "student"),
    ]

    for email, password, full_name, role in extra_users:
        user = get_or_create_user(email, password, full_name, role)
        get_or_create_profile(
            user,
            f"Sample profile for {full_name}.",
            "beginner",
            "0000000000",
            date(1995, 1, 1),
        )

    # Add a second course and enroll the new users
    new_course = get_or_create_course(
        "Data Science Essentials",
        "A practical course for learning data science fundamentals.",
        instructor,
        "intermediate",
        True,
    )

    new_lesson = Lesson.query.filter_by(course_id=new_course.id, title="Intro to Data Analysis").first()
    if not new_lesson:
        new_lesson = Lesson(
            course=new_course,
            title="Intro to Data Analysis",
            content="Learn how to explore datasets and summarize findings.",
            duration_minutes=45,
            is_published=True,
        )
        db.session.add(new_lesson)
        db.session.flush()

    new_assignment = Assignment.query.filter_by(course_id=new_course.id, title="Data Science Homework").first()
    if not new_assignment:
        new_assignment = Assignment(
            course=new_course,
            title="Data Science Homework",
            description="A short assignment on data analysis basics.",
            instructions="Submit your findings in a brief report.",
            due_date=datetime.now() + timedelta(days=10),
        )
        db.session.add(new_assignment)
        db.session.flush()

    # Enroll the 5 new users into the new course
    for email, _, _, _ in extra_users:
        user = User.query.filter_by(email=email).first()
        if user:
            enrollment = CourseEnrollment.query.filter_by(student_id=user.id, course_id=new_course.id).first()
            if not enrollment:
                db.session.add(
                    CourseEnrollment(
                        student_id=user.id,
                        course=new_course,
                        status="enrolled",
                    )
                )

    db.session.commit()
    print("Seed data inserted/verified successfully.")
