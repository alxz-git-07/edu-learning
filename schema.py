from marshmallow import Schema, fields, validate


class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    email = fields.Email(required=True, validate=validate.Email())
    password = fields.Str(required=True, load_only=True, validate=validate.Length(min=8))
    full_name = fields.Str(required=True)
    role = fields.Str(load_default="student")
    is_active = fields.Bool(load_default=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    profile = fields.Nested("UserProfileSchema", dump_only=True, exclude=("user",))


class UserProfileSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(required=True)
    bio = fields.Str(allow_none=True)
    experience_level = fields.Str(
        validate=validate.OneOf(["beginner", "intermediate", "expert"]),
        allow_none=True
    )
    phone = fields.Str(allow_none=True)
    dob = fields.Date(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    user = fields.Nested("UserSchema", only=("id", "email", "full_name"), dump_only=True)


class CourseSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    description = fields.Str(required=True)
    tm_id = fields.Int(required=True)
    level = fields.Str(
        validate=validate.OneOf(["beginner", "intermediate", "expert"]),
        allow_none=True
    )
    is_published = fields.Bool(load_default=False)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    tm_user = fields.Nested("UserSchema", only=("id", "email", "full_name"), dump_only=True)


class CourseEnrollmentSchema(Schema):
    id = fields.Int(dump_only=True)
    student_id = fields.Int(required=True)
    course_id = fields.Int(required=True)
    enrollment_date = fields.DateTime(dump_only=True)
    completion_date = fields.DateTime(allow_none=True)
    status = fields.Str(load_default="enrolled")
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    student = fields.Nested("UserSchema", only=("id", "email", "full_name"), dump_only=True)
    course = fields.Nested("CourseSchema", only=("id", "title", "level"), dump_only=True)


class LessonSchema(Schema):
    id = fields.Int(dump_only=True)
    course_id = fields.Int(required=True)
    title = fields.Str(required=True)
    content = fields.Str(allow_none=True)
    duration_minutes = fields.Int(allow_none=True)
    is_published = fields.Bool(load_default=False)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    course = fields.Nested("CourseSchema", only=("id", "title"), dump_only=True)


class AssignmentSchema(Schema):
    id = fields.Int(dump_only=True)
    course_id = fields.Int(required=True)
    title = fields.Str(required=True)
    description = fields.Str(required=True)
    instructions = fields.Str(allow_none=True)
    due_date = fields.DateTime(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    course = fields.Nested("CourseSchema", only=("id", "title"), dump_only=True)


class AssignmentSubmissionSchema(Schema):
    id = fields.Int(dump_only=True)
    assignment_id = fields.Int(required=True)
    student_id = fields.Int(required=True)
    submission = fields.Str(allow_none=True)
    submitted_at = fields.DateTime(dump_only=True)
    graded_at = fields.DateTime(allow_none=True)
    status = fields.Str(load_default="submitted")
    score = fields.Int(allow_none=True)
    graded_by = fields.Int(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    assignment = fields.Nested("AssignmentSchema", only=("id", "title"), dump_only=True)
    student = fields.Nested("UserSchema", only=("id", "email", "full_name"), dump_only=True)
    graded_by_user = fields.Nested("UserSchema", only=("id", "email", "full_name"), dump_only=True)


class CourseLessonSchema(Schema):
    id = fields.Int(dump_only=True)
    lesson_id = fields.Int(allow_none=True)
    course_id = fields.Int(allow_none=True)
    title = fields.Str(required=True)
    description = fields.Str(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    lesson = fields.Nested("LessonSchema", only=("id", "title"), dump_only=True)
    course = fields.Nested("CourseSchema", only=("id", "title"), dump_only=True)


# Single instances
user_schema = UserSchema()
users_schema = UserSchema(many=True)

user_profile_schema = UserProfileSchema()
user_profiles_schema = UserProfileSchema(many=True)

course_schema = CourseSchema()
courses_schema = CourseSchema(many=True)

course_enrollment_schema = CourseEnrollmentSchema()
course_enrollments_schema = CourseEnrollmentSchema(many=True)

lesson_schema = LessonSchema()
lessons_schema = LessonSchema(many=True)

assignment_schema = AssignmentSchema()
assignments_schema = AssignmentSchema(many=True)

assignment_submission_schema = AssignmentSubmissionSchema()
assignment_submissions_schema = AssignmentSubmissionSchema(many=True)

course_lesson_schema = CourseLessonSchema()
course_lessons_schema = CourseLessonSchema(many=True)