import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { courseService } from '../../services/courseService';

function AssignmentPage() {
  const { isAuthenticated } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittingId, setSubmittingId] = useState(null);
  const [submissionText, setSubmissionText] = useState({});
  const [submittedIds, setSubmittedIds] = useState([]);

  useEffect(() => {
    async function loadAssignments() {
      if (!isAuthenticated) {
        setAssignments([]);
        setLoading(false);
        return;
      }

      try {
        const response = await courseService.getMyCourses();
        const enrolledCourses = response.enrolled_courses || [];

        if (enrolledCourses.length === 0) {
          setAssignments([]);
          return;
        }

        const assignmentLists = await Promise.all(
          enrolledCourses.map(async (course) => {
            const courseAssignments = await courseService.getCourseAssignments(course.id);
            return (courseAssignments || []).map((assignment) => ({
              ...assignment,
              courseTitle: course.title,
            }));
          })
        );

        setAssignments(assignmentLists.flat());
      } catch (err) {
        setError(err.message || 'Unable to load your assignments.');
      } finally {
        setLoading(false);
      }
    }

    void loadAssignments();
  }, [isAuthenticated]);

  async function handleSubmit(assignmentId) {
    if (!isAuthenticated) {
      toast.error('Please sign in to submit an assignment.');
      return;
    }

    const submission = (submissionText[assignmentId] || '').trim();
    if (!submission) {
      toast.error('Please enter your submission before sending it.');
      return;
    }

    setSubmittingId(assignmentId);

    try {
      const data = await courseService.submitAssignment(assignmentId, submission);
      setSubmittedIds((current) => [...current, assignmentId]);
      setSubmissionText((current) => ({ ...current, [assignmentId]: '' }));
      toast.success(data?.message || 'Assignment submitted successfully.');
    } catch (err) {
      const message = err.message || 'Unable to submit your assignment.';
      toast.error(message);
    } finally {
      setSubmittingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Assignments</h1>
        <p className="mt-2 text-sm text-gray-600">Track your enrolled course assignments and submit your work here.</p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">Loading assignments...</div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">{error}</div>
      ) : !isAuthenticated ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">Please sign in to view your assignments.</div>
      ) : assignments.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">You do not have any assignments from your enrolled courses yet.</div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => {
            const alreadySubmitted = submittedIds.includes(assignment.id);
            return (
              <div key={assignment.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-blue-600">{assignment.courseTitle}</p>
                    <h2 className="mt-1 text-lg font-semibold text-gray-900">{assignment.title}</h2>
                    <p className="mt-2 text-sm text-gray-600">{assignment.description}</p>
                  </div>
                  {alreadySubmitted && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                      Submitted
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-3">
                  <label htmlFor={`assignment-${assignment.id}`} className="block text-sm font-medium text-gray-700">
                    Your submission
                  </label>
                  <textarea
                    id={`assignment-${assignment.id}`}
                    rows="5"
                    value={submissionText[assignment.id] || ''}
                    onChange={(event) =>
                      setSubmissionText((current) => ({
                        ...current,
                        [assignment.id]: event.target.value,
                      }))
                    }
                    disabled={alreadySubmitted || submittingId === assignment.id}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100"
                    placeholder="Write your assignment submission here..."
                  />

                  <button
                    type="button"
                    onClick={() => void handleSubmit(assignment.id)}
                    disabled={alreadySubmitted || submittingId === assignment.id}
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                  >
                    {submittingId === assignment.id ? 'Submitting...' : alreadySubmitted ? 'Submitted' : 'Submit assignment'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AssignmentPage;
