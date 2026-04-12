const { ObjectId } = require("mongodb");

async function getAllTrips(req, res) {
  try {
    const db = req.app.locals.db;

    if (!db) {
      return res.status(500).json({ message: "Error connected with database" });
    }

    const trips = await db.collection("trips").find({}).toArray();
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


async function getTripById(req, res) {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid trip id" });
    }

    const trip = await db.collection("trips").findOne({
      _id: new ObjectId(id),
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createTrip(req, res) {
  try {
    const db = req.app.locals.db;
    const result = await db.collection("trips").insertOne(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteTrip(req, res) {
  try {
    const db = req.app.locals.db;
     const { id } = req.params;

     if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid trip id" });
    }

    const result = await db.collection("trips").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json({
      message: "Trip deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateTrip(req, res) {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid trip id" });
    }

    const updateData = { ...req.body };
    delete updateData._id;

    const result = await db.collection("trips").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json({
      message: "Trip updated successfully",
      updatedId: id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAllTrips,
  getTripById,
  updateTrip,
  createTrip,
  deleteTrip,
};