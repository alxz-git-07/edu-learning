const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.message || 'Request failed');
  }

  return data;
}


export const courseService = {
  getCourses() {
    return request('/courses');
  },

  getCourse(id) {
    return request(`/courses/${id}`);
  },

  getCourseLessons(id) {
    return request(`/courses/${id}/lessons`);
  },
  

  getCourseAssignments(id) {
    return request(`/courses/${id}/assignments`);
  },
  

  getMyCourses() {
    return request('/my-courses');
  },
};
