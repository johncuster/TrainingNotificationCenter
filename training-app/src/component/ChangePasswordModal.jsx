import { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../AuthContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';

const ChangePasswordModal = ({ onClose }) => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      alert("Current password is required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/member/change_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.user_id,
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to change password');

      alert(data.message);
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Change Password</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers className="space-y-4">
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            margin="dense"
          />

          <TextField
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            margin="dense"
          />

          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            margin="dense"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
    // <div className="modal-backdrop">
    //   <div className="modal">
    //     <h2>Change Password</h2>
    //     <form onSubmit={handleSubmit} className="space-y-4">

    //       <label>
    //         Current Password
    //         <input
    //           type="password"
    //           value={currentPassword}
    //           onChange={(e) => setCurrentPassword(e.target.value)}
    //           required
    //         />
    //       </label>

    //       <label>
    //         New Password
    //         <input
    //           type="password"
    //           value={newPassword}
    //           onChange={(e) => setNewPassword(e.target.value)}
    //           required
    //         />
    //       </label>

    //       <label>
    //         Confirm New Password
    //         <input
    //           type="password"
    //           value={confirmPassword}
    //           onChange={(e) => setConfirmPassword(e.target.value)}
    //           required
    //         />
    //       </label>

    //       <div className="modal-buttons flex justify-end gap-2">
    //         <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 bg-gray-300 rounded">
    //           Cancel
    //         </button>
    //         <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
    //           {loading ? 'Saving...' : 'Save'}
    //         </button>
    //       </div>
    //     </form>
    //   </div>
    // </div>
  );
};

ChangePasswordModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ChangePasswordModal;
