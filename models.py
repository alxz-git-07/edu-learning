from sqlalchemy import MetaData, CheckConstraint, UniqueConstraint
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

metadata = MetaData(naming_convention={
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
})

db = SQLAlchemy(metadata=metadata)


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='student')
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.now,
        onupdate=datetime.now,
        nullable=False
    )

    profile = db.relationship(
        'UserProfile',
        back_populates='user',
        uselist=False,
        cascade='all, delete-orphan'
    )
    taught_courses = db.relationship(
        'Course',
        back_populates='tm_user',
        foreign_keys='Course.tm_id',
        cascade='all, delete-orphan'
    )
    enrollments = db.relationship(
        'CourseEnrollment',
        back_populates='student',
        foreign_keys='CourseEnrollment.student_id',
        cascade='all, delete-orphan'
    )
    submissions = db.relationship(
        'AssignmentSubmission',
        back_populates='student',
        foreign_keys='AssignmentSubmission.student_id',
        cascade='all, delete-orphan'
    )
    graded_submissions = db.relationship(
        'AssignmentSubmission',
        back_populates='graded_by_user',
        foreign_keys='AssignmentSubmission.graded_by',
        cascade='all, delete-orphan'
    )


class UserProfile(db.Model):
    __tablename__ = 'user_profiles'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    bio = db.Column(db.Text, nullable=True)
    experience_level = db.Column(db.String(20), nullable=True)
    phone = db.Column(db.String(50), nullable=True)
    dob = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.now,
        onupdate=datetime.now,
        nullable=False
    )

    user = db.relationship('User', back_populates='profile')

    __table_args__ = (
        CheckConstraint(
            "experience_level IN ('beginner', 'intermediate', 'expert')",
            name='ck_user_profiles_experience_level'
        ),
    )
    
class Course(db.Model):
    __tablename__ = 'courses'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    tm_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    level = db.Column(db.String(20), nullable=True)
    is_published = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.now,
        onupdate=datetime.now,
        nullable=False
    )

    tm_user = db.relationship('User', back_populates='taught_courses', foreign_keys=[tm_id])
    lessons = db.relationship('Lesson', back_populates='course', cascade='all, delete-orphan')
    assignments = db.relationship('Assignment', back_populates='course', cascade='all, delete-orphan')
    enrollments = db.relationship('CourseEnrollment', back_populates='course', cascade='all, delete-orphan')
    course_lessons = db.relationship('CourseLesson', back_populates='course', cascade='all, delete-orphan')

    __table_args__ = (
        CheckConstraint(
            "level IN ('beginner', 'intermediate', 'expert')",
            name='ck_courses_level'
        ),
    )


class CourseEnrollment(db.Model):
    __tablename__ = 'course_enrollments'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    enrollment_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    completion_date = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(50), default='enrolled', nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.now,
        onupdate=datetime.now,
        nullable=False
    )

    student = db.relationship('User', back_populates='enrollments', foreign_keys=[student_id])
    course = db.relationship('Course', back_populates='enrollments', foreign_keys=[course_id])

    __table_args__ = (
        UniqueConstraint('student_id', 'course_id', name='uq_course_enrollments_student_course'),
    )


class Lesson(db.Model):
    __tablename__ = 'lessons'

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=True)
    duration_minutes = db.Column(db.Integer, nullable=True)
    is_published = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.now,
        onupdate=datetime.now,
        nullable=False
    )

    course = db.relationship('Course', back_populates='lessons')


class Assignment(db.Model):
    __tablename__ = 'assignments'

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    instructions = db.Column(db.Text, nullable=True)
    due_date = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.now,
        onupdate=datetime.now,
        nullable=False
    )

    course = db.relationship('Course', back_populates='assignments')
    submissions = db.relationship('AssignmentSubmission', back_populates='assignment', cascade='all, delete-orphan')


class AssignmentSubmission(db.Model):
    __tablename__ = 'assignment_submissions'

    id = db.Column(db.Integer, primary_key=True)
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignments.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    submission = db.Column(db.Text, nullable=True)
    submitted_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    graded_at = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(50), default='submitted', nullable=False)
    score = db.Column(db.Integer, nullable=True)
    graded_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.now,
        onupdate=datetime.now,
        nullable=False
    )

    assignment = db.relationship('Assignment', back_populates='submissions')
    student = db.relationship('User', back_populates='submissions', foreign_keys=[student_id])
    graded_by_user = db.relationship('User', back_populates='graded_submissions', foreign_keys=[graded_by])


class CourseLesson(db.Model):
    __tablename__ = 'course_lessons'

    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.id'), nullable=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now, nullable=False)

    lesson = db.relationship('Lesson')
    course = db.relationship('Course', back_populates='course_lessons')

