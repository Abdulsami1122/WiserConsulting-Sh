'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio: string;
  fullBio?: string;
  image: string;
  skills: string[];
  email?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  expertise: string[];
  achievements?: string[];
  order: number;
  isActive: boolean;
}

const AdminTeam = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    fullBio: '',
    image: '👨‍💼',
    skills: [] as string[],
    email: '',
    linkedin: '',
    github: '',
    twitter: '',
    expertise: [] as string[],
    achievements: [] as string[],
    order: 0,
    isActive: true,
  });
  const [skillInput, setSkillInput] = useState('');
  const [expertiseInput, setExpertiseInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/team`, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch team members');
      }
      
      const data = await res.json();
      if (data.success) {
        // Sort members: Full Stack and MERN Stack first, then others
        const sortedMembers = (data.data || []).sort((a: TeamMember, b: TeamMember) => {
          const roleA = a.role?.toLowerCase() || '';
          const roleB = b.role?.toLowerCase() || '';
          
          // Priority order: Full Stack > MERN Stack > Others
          const getPriority = (role: string) => {
            if (role.includes('full stack')) return 1;
            if (role.includes('mern stack')) return 2;
            return 3;
          };
          
          const priorityA = getPriority(roleA);
          const priorityB = getPriority(roleB);
          
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
          
          // If same priority, sort by order field, then by name
          if (a.order !== b.order) {
            return a.order - b.order;
          }
          return a.name.localeCompare(b.name);
        });
        
        setMembers(sortedMembers);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const url = editingMember
        ? `${API_URL}/admin/team/${editingMember._id}`
        : `${API_URL}/admin/team`;
      const method = editingMember ? 'PUT' : 'POST';

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('role', formData.role);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('fullBio', formData.fullBio);
      formDataToSend.append('email', formData.email || '');
      formDataToSend.append('linkedin', formData.linkedin || '');
      formDataToSend.append('github', formData.github || '');
      formDataToSend.append('twitter', formData.twitter || '');
      formDataToSend.append('order', formData.order.toString());
      formDataToSend.append('isActive', formData.isActive.toString());
      
      // Append arrays
      formData.skills.forEach((skill, index) => {
        formDataToSend.append(`skills[${index}]`, skill);
      });
      formData.expertise.forEach((exp, index) => {
        formDataToSend.append(`expertise[${index}]`, exp);
      });
      formData.achievements.forEach((ach, index) => {
        formDataToSend.append(`achievements[${index}]`, ach);
      });
      
      // Append image file if selected, otherwise append existing image URL or emoji
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      } else if (formData.image && !formData.image.startsWith('http')) {
        // If it's an emoji or text, send it as a regular field
        formDataToSend.append('image', formData.image);
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type header, let browser set it with boundary for FormData
        },
        credentials: 'include',
        body: formDataToSend,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save team member');
      }

      const data = await res.json();
      if (data.success) {
        fetchMembers();
        setShowModal(false);
        resetForm();
      } else {
        throw new Error(data.message || 'Failed to save team member');
      }
    } catch (error) {
      console.error('Error saving team member:', error);
      alert(error instanceof Error ? error.message : 'Failed to save team member. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/team/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to delete team member');
      }

      const data = await res.json();
      if (data.success) {
        fetchMembers();
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
      alert('Failed to delete team member. Please try again.');
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      fullBio: member.fullBio || '',
      image: member.image,
      skills: member.skills,
      email: member.email || '',
      linkedin: member.linkedin || '',
      github: member.github || '',
      twitter: member.twitter || '',
      expertise: member.expertise,
      achievements: member.achievements || [],
      order: member.order,
      isActive: member.isActive,
    });
    // Set image preview if it's a URL, otherwise clear it
    if (member.image && (member.image.startsWith('http') || member.image.startsWith('/'))) {
      setImagePreview(member.image);
    } else {
      setImagePreview(null);
    }
    setImageFile(null);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      bio: '',
      fullBio: '',
      image: '👨‍💼',
      skills: [],
      email: '',
      linkedin: '',
      github: '',
      twitter: '',
      expertise: [],
      achievements: [],
      order: 0,
      isActive: true,
    });
    setEditingMember(null);
    setSkillInput('');
    setExpertiseInput('');
    setAchievementInput('');
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addItem = (type: 'skills' | 'expertise' | 'achievements') => {
    const input = type === 'skills' ? skillInput : type === 'expertise' ? expertiseInput : achievementInput;
    if (input.trim()) {
      setFormData({
        ...formData,
        [type]: [...formData[type], input.trim()],
      });
      if (type === 'skills') setSkillInput('');
      if (type === 'expertise') setExpertiseInput('');
      if (type === 'achievements') setAchievementInput('');
    }
  };

  const removeItem = (type: 'skills' | 'expertise' | 'achievements', index: number) => {
    setFormData({
      ...formData,
      [type]: formData[type].filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-5 h-5" />
          Add Team Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start gap-4 mb-4">
              {member.image && (member.image.startsWith('http') || member.image.startsWith('/')) ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-16 h-16 object-cover rounded-full border-2 border-gray-200"
                />
              ) : (
                <div className="text-5xl">{member.image || '👨‍💼'}</div>
              )}
              <div className="flex-1">
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4 line-clamp-2">{member.bio}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {member.skills.slice(0, 3).map((skill, idx) => (
                <span key={idx} className="px-2 py-1 text-xs bg-gray-100 rounded">
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(member)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(member._id)}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingMember ? 'Edit Team Member' : 'Add Team Member'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Select a role</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="MERN Stack Developer">MERN Stack Developer</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Mobile App Developer">Mobile App Developer</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={2}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Bio</label>
                <textarea
                  value={formData.fullBio}
                  onChange={(e) => setFormData({ ...formData, fullBio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                  )}
                  {!imagePreview && formData.image && !formData.image.startsWith('http') && (
                    <div className="mt-2 text-4xl">{formData.image}</div>
                  )}
                  {!imagePreview && formData.image && formData.image.startsWith('http') && (
                    <div className="mt-2">
                      <img
                        src={formData.image}
                        alt="Current"
                        className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                  <input
                    type="url"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                  <input
                    type="url"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('skills'))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Add skill"
                  />
                  <button type="button" onClick={() => addItem('skills')} className="px-4 py-2 bg-gray-200 rounded-lg">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                      {skill}
                      <button type="button" onClick={() => removeItem('skills', idx)} className="text-blue-600">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expertise</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={expertiseInput}
                    onChange={(e) => setExpertiseInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('expertise'))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Add expertise"
                  />
                  <button type="button" onClick={() => addItem('expertise')} className="px-4 py-2 bg-gray-200 rounded-lg">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.expertise.map((exp, idx) => (
                    <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2">
                      {exp}
                      <button type="button" onClick={() => removeItem('expertise', idx)} className="text-green-600">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Achievements</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('achievements'))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Add achievement"
                  />
                  <button type="button" onClick={() => addItem('achievements')} className="px-4 py-2 bg-gray-200 rounded-lg">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.achievements.map((ach, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-2">
                      {ach}
                      <button type="button" onClick={() => removeItem('achievements', idx)} className="text-purple-600">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium text-gray-700">Active</label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  {editingMember ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeam;
