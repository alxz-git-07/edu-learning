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

with app.app_context():
    db.drop_all()
    db.create_all()

    admin = User(
        email="admin@example.com",
        password="admin123",
        full_name="Admin User",
        role="admin",
        is_active=True,
    )
    instructor = User(
        email="instructor@example.com",
        password="instructor123",
        full_name="Alice Johnson",
        role="instructor",
        is_active=True,
    )
    student = User(
        email="student@example.com",
        password="student123",
        full_name="Bob Smith",
        role="student",
        is_active=True,
    )

    db.session.add_all([admin, instructor, student])
    db.session.flush()

    profile = UserProfile(
        user_id=instructor.id,
        bio="Senior instructor with 10+ years of experience.",
        experience_level="expert",
        phone="1234567890",
        dob=date(1990, 5, 15),
    )

    course = Course(
        title="Python Basics",
        description="An introductory course for learning Python programming.",
        tm_id=instructor.id,
        level="beginner",
        is_published=True,
    )

    lesson = Lesson(
        course=course,
        title="Introduction to Variables",
        content="Learn how variables store values in Python.",
        duration_minutes=30,
        is_published=True,
    )

    assignment = Assignment(
        course=course,
        title="Python Quiz",
        description="A short quiz covering Python basics.",
        instructions="Answer all questions and submit your responses.",
        due_date=datetime.utcnow() + timedelta(days=7),
    )

    enrollment = CourseEnrollment(
        student_id=student.id,
        course=course,
        status="enrolled",
    )

    submission = AssignmentSubmission(
        assignment=assignment,
        student=student,
        submission="Completed the quiz successfully.",
        submitted_at=datetime.utcnow(),
        status="submitted",
        score=90,
        graded_by=instructor.id,
        graded_at=datetime.utcnow(),
    )

    course_lesson = CourseLesson(
        lesson=lesson,
        course=course,
        title=lesson.title,
        description="A linked lesson entry for the course.",
    )

    db.session.add_all([profile, course, lesson, assignment, enrollment, submission, course_lesson])
    db.session.commit()

    print("Seed data inserted successfully.")


