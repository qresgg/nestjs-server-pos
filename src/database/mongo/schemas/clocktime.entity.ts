import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {ObjectId} from "typeorm";

@Schema({ timestamps: true })
export class Clocktime{
    _id:  ObjectId;

    @Prop({ required: true })
    staffId: string;

    @Prop({ type: Date, default: Date.now })
    date: Date;

    @Prop({
        type: {
            time: { type: Date, default: Date.now },
            location: { type: String, required: true },
        },
        required: true
    })
    clockIn: {
        time: Date,
        location: string,
    }

    @Prop({
        type: {
            time: { type: Date, required: false },
            location: { type: String, required: false },
        },
        required: false,
    })
    clockOut?: {
        time?: Date;
        location?: string;
    };
    @Prop({ type: Number, required: false })
    totalHours?: number;
}

export const ClocktimeSchema = SchemaFactory.createForClass(Clocktime);