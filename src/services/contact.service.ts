import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { Contact } from "@prisma/client";
import { ContactCreationDTO } from "src/dtos/contact-dto";

@Injectable()
export class ContactService{
    constructor(private prisma: PrismaService) {}

    async createContact(data: ContactCreationDTO): Promise<Contact> {
        return this.prisma.contact.create({
            data,
        });
    }

    async getByParentID(
        userId: number,
    ) {
        const contact_teachers = await this.prisma.contact.findMany({
        where: {
            parent_id: Number(userId),
        },
        orderBy: [
            {
            id: "asc",
            },
        ],
        include: {
            teacher: {
                select: {
                    id: true,
                    name: true,
                }
            },
        },
        });

        const teachers = contact_teachers.map((teacher) => ({
            id: teacher.teacher?.id,
            name: teacher.teacher?.name || null,
          }));

        return teachers;
    }

    async getByTeacherID(
        userId: number,
    ) {
        const contact_parents = await this.prisma.contact.findMany({
        where: {
            teacher_id: Number(userId),
        },
        orderBy: [
            {
            id: "asc",
            },
        ],
        include: {
            parent: {
                select: {
                    id: true,
                    name: true,
                }
            },
        },
        });

        const parents = contact_parents.map((parent) => ({
            name: parent.parent?.name || null,
          }));

        return parents;
    }

    async getByContactByParentIDAndTeacherID(
        parentId: number, teacherId : number
    ): Promise<Contact[] | null> {
        return this.prisma.contact.findMany({
        where: {
            teacher_id: Number(teacherId),
            parent_id: Number(parentId)
        },
        orderBy: [
            {
            id: "asc",
            },
        ]
        });
    }

}
