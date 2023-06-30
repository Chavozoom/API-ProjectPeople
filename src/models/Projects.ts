import mongoose, { Schema } from "mongoose";

interface ProjectAttrs {
  title: string;
  description: string;
  stacks?: string[];
  userId: string;
}

interface ProjectModel extends mongoose.Model<ProjectDoc> {
  build(attrs: ProjectAttrs): ProjectDoc;
}

interface ProjectDoc extends mongoose.Document {
  title: string;
  description: string;
  stacks?: string[];
  userId: string;
}

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    stacks: {
      type: [String],
      required: false,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

projectSchema.statics.build = (attrs: ProjectAttrs) => {
  return new Project(attrs);
};

const Project = mongoose.model<ProjectDoc, ProjectModel>(
  "Project",
  projectSchema
);

export { Project };
