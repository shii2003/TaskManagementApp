import { Schema, model, Document, Types } from "mongoose";

export type TaskStatus = "todo" | "in_progress" | "completed";

export type AssignedUserEmail = 'john.doe@example.com' | 'jane.smith@example.com' | 'mike.johnson@example.com' | 'sarah.wilson@example.com';

export interface ITask extends Document {
    title: string;
    description?: string;
    status: TaskStatus;
    assignedTo?: AssignedUserEmail;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
    {
        title:
        {
            type: String,
            required: true
        },
        description:
        {
            type: String
        },
        status:
        {
            type: String,
            enum: ["todo", "in_progress", "completed"],
            default: "todo"
        },
        assignedTo: {
            type: String,
            enum: ['john.doe@example.com', 'jane.smith@example.com', 'mike.johnson@example.com', 'sarah.wilson@example.com']
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default model<ITask>("Task", taskSchema);
