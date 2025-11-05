const memberQueries = {

    selectMembers: 
        `SELECT * FROM user_member`,

    createMember:
        `INSERT INTO user_member (user_ln, user_fn, user_role, user_email)
        VALUES (?, ?, ?, ?)`,

    updateMember:
        `UPDATE user_member
        SET user_ln=?, user_fn=?, user_role=?, user_email=?
        WHERE user_id=?`,

    deleteTraining:
        `DELETE FROM user_member WHERE user_id = ?`
};

module.exports = memberQueries;