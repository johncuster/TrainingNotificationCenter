const trainingQueries = {

    selectTraining: 
        `SELECT * FROM training`,

    createTraining:
        `INSERT INTO training (training_title, training_desc, training_link)
        VALUES (?, ?, ?)`,

    updateTrainig:
        `UPDATE training
        SET training_title=?, training_desc=?, training_link=?
        WHERE training_id=?`,

    deleteTraining:
        `DELETE FROM training WHERE training_id = ?`
};

module.exports = trainingQueries;