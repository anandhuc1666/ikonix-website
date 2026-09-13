import mongoose from "mongoose";

const youtubeSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const Youtube = mongoose.model("Youtube", youtubeSchema);

export default Youtube;