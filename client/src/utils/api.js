import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) localStorage.removeItem('token');
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  addFavorite: (gameId) => API.post(`/auth/favorites/${gameId}`),
  rateGame: (gameId, rating) => API.post(`/auth/rate/${gameId}`, { rating })
};

export const gameAPI = {
  getAll: (params) => API.get('/games', { params }),
  getBySlug: (slug) => API.get(`/games/${slug}`),
  getFeatured: () => API.get('/games/featured'),
  getTrending: () => API.get('/games/trending'),
  getEditorPicks: () => API.get('/games/editor-picks'),
  getLowSpec: () => API.get('/games/low-spec'),
  search: (params) => API.get('/games/search', { params }),
  incrementDownload: (id) => API.post(`/games/${id}/download`),
  likeGame: (id) => API.post(`/games/${id}/like`)
};

export const categoryAPI = {
  getAll: () => API.get('/categories'),
  getBySlug: (slug) => API.get(`/categories/${slug}`),
  getGames: (slug, params) => API.get(`/categories/${slug}/games`, { params })
};

export const blogAPI = {
  getAll: (params) => API.get('/blogs', { params }),
  getBySlug: (slug) => API.get(`/blogs/${slug}`),
  getFeatured: () => API.get('/blogs/featured')
};

export const commentAPI = {
  getByGame: (gameId) => API.get(`/comments/game/${gameId}`),
  create: (data) => API.post('/comments', data),
  delete: (id) => API.delete(`/comments/${id}`)
};

export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  createGame: (data) => API.post('/admin/games', data),
  updateGame: (id, data) => API.put(`/admin/games/${id}`, data),
  deleteGame: (id) => API.delete(`/admin/games/${id}`),
  getSliders: () => API.get('/admin/sliders'),
  createSlider: (data) => API.post('/admin/sliders', data),
  updateSlider: (id, data) => API.put(`/admin/sliders/${id}`, data),
  deleteSlider: (id) => API.delete(`/admin/sliders/${id}`),
  getUsers: () => API.get('/admin/users'),
  banUser: (id) => API.put(`/admin/users/${id}/ban`),
  unbanUser: (id) => API.put(`/admin/users/${id}/unban`),
  setUserRole: (id, role) => API.put(`/admin/users/${id}/role`, { role }),
  getAdverts: () => API.get('/admin/adverts'),
  createAdvert: (data) => API.post('/admin/adverts', data),
  updateAdvert: (id, data) => API.put(`/admin/adverts/${id}`, data),
  deleteAdvert: (id) => API.delete(`/admin/adverts/${id}`),
  createCategory: (data) => API.post('/admin/categories', data),
  updateCategory: (id, data) => API.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => API.delete(`/admin/categories/${id}`),
  createBlog: (data) => API.post('/admin/blogs', data),
  updateBlog: (id, data) => API.put(`/admin/blogs/${id}`, data),
  deleteBlog: (id) => API.delete(`/admin/blogs/${id}`),
  getComments: () => API.get('/admin/comments'),
  deleteComment: (id) => API.delete(`/admin/comments/${id}`)
};

export default API;
