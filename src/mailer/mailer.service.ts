
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import mongoose from 'mongoose';
import * as nodemailer from 'nodemailer';
import { User } from 'src/user/entities/user.entities';

@Injectable()
export class MailerService {
    private transporter: nodemailer.Transporter;

    constructor(
        @InjectModel(User.name) private userModel: mongoose.Model<User>,
    ) {
        this.transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.ACCOUNT_MAIL,
                pass: process.env.PASSWORD_MAIL,
            },
        });
    }

    async sendEmail(data: any): Promise<any> {
        let email = "";
        let user = <User>{};
        if (data.email) {
            email = data.email;
        } else {
            if (data.id) {
                user = await this.userModel.findById(data.id);
                if (user.email) {
                    email = user.email;
                } else {
                    return {
                        status: 404,
                        message: "Email has not been authenticated"
                    }
                }
            } else {
                return {
                    status: 400,
                    message: "Email or id is required"
                }
            }
        }
        if (data.content) {
            const mailOptions = {
                from: process.env.ACCOUNT_MAI,
                to: email,
                subject: 'OTP Verification',
                text: data.content,
            };
            await this.transporter.sendMail(mailOptions);
            return {
                status: 200,
                message: `Content has been sent to email ${email}`
            }
        }
        else {
            return {
                status: 404,
                message: "You must submit content"
            }
        }
    }
}
