from app import app
from models import (
    User,
    Course,
    AssignmentSubmission,
    UserProfile,
)

with app.app_context():
    print("\n---All users--- ")
    users = User.query.all()
    for user in users:
        print(f"{user.id} {user.full_name} {user.email} {user.role}")

    print("\n---All courses with instructors ---")
    courses = Course.query.all()
    for course in courses:
        print(f"{course.title} Instructor: {course.tm_user.full_name}")

    print("\n---Students enrolled in Python Basics ---")
    course = Course.query.filter_by(title="Python Basics").first()
    if course:
        for enrollment in course.enrollments:
            print(f"{enrollment.student.full_name}")

    print("\n---All assignment submissions---")
    submissions = AssignmentSubmission.query.all()
    for sub in submissions:
        print(
            f"{sub.student.full_name} "
            f"{sub.assignment.title} "
            f"score={sub.score} status={sub.status}"
        )

    print("\n---Users with profiles---")
    profiles = UserProfile.query.all()
    for profile in profiles:
        print(f"{profile.user.full_name} {profile.experience_level}")

    print("\n---All students---")
    students = User.query.filter_by(role="student").all()
    for student in students:
        print(student.full_name)

