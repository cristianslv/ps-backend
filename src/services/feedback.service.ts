import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Feedback } from '@prisma/client';
import { FeedbackCreationDTO } from 'src/dtos/feedback-dto';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async findByID(
    id: number,
  ): Promise<Feedback | null> {
    return this.prisma.feedback.findUnique({
      where: {
        id: Number(id)
      },
    });
  }

  async findByUserID(
    userId: number,
  ): Promise<Feedback[] | null> {
    return this.prisma.feedback.findMany({
      where: {
        OR: [
          {
            parent_id: Number(userId)
          },
          {
            teacher_id: Number(userId)
          }
        ],
      },
      orderBy: [
        {
          active: "desc",
        },
        {
          id: "asc",
        },
      ]
    });
  }

  // async users(params: {
  //   skip?: number;
  //   take?: number;
  //   cursor?: Prisma.UserWhereUniqueInput;
  //   where?: Prisma.UserWhereInput;
  //   orderBy?: Prisma.UserOrderByWithRelationInput;
  // }): Promise<User[]> {
  //   const { skip, take, cursor, where, orderBy } = params;
  //   return this.prisma.user.findMany({
  //     skip,
  //     take,
  //     cursor,
  //     where,
  //     orderBy,
  //   });
  // }

  async create(data: FeedbackCreationDTO): Promise<Feedback> {
    return this.prisma.feedback.create({
      data,
    });
  }

  async update(response: string, id: number): Promise<Feedback> {
    return this.prisma.feedback.update({
      data: {
        response: response
      },
      where: {
        id: Number(id)
      },
    });
  }

  async softDeleteFeedback(id: number): Promise<Feedback> {
    return this.prisma.feedback.update({
      data: {
        active: false,
      },
      where: {
        id: Number(id)
      },
    });
  }

  async getNumberOfFeedbacksOverAYear(parentId: number, teacherId: number): Promise<number> {
    const agg = await this.prisma.feedback.aggregate(
      {
        _count: {
          _all: true
        },
        where: {
          parent_id: {
            equals: Number(parentId)
          },
          teacher_id: {
            equals: Number(teacherId)
          },
          created_at: {
            // maior que um ano atrás
            gte: new Date(new Date().setFullYear(new Date().getFullYear() -1)),
          }
        } 
      }
    );

    return agg._count._all;
  }
}
