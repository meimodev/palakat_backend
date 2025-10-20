import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ExpenseListQueryDto } from './dto/expense-list.dto';

@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ExpenseListQueryDto) {
    const { churchId, search, skip, take } = query;

    const where: any = {
      churchId: churchId,
    };

    if (search) {
      where.OR = [{ accountNumber: { contains: search, mode: 'insensitive' } }];
    }

    const [total, expenses] = await (this.prisma as any).$transaction([
      (this.prisma as any).expense.count({ where }),
      (this.prisma as any).expense.findMany({
        where,
        take,
        skip,
        orderBy: { id: 'desc' },
        include: {
          activity: {
            include: {
              approvers: true,
              supervisor: true,
            },
          },
        },
      }),
    ]);

    // Track which fields matched the search
    let searchInfo = '';
    if (search && expenses.length > 0) {
      const matchedFields = new Set<string>();
      expenses.forEach((expense: any) => {
        if (
          expense.accountNumber?.toLowerCase().includes(search.toLowerCase())
        ) {
          matchedFields.add('accountNumber');
        }
      });
      if (matchedFields.size > 0) {
        searchInfo = ` (matched in: ${Array.from(matchedFields).join(', ')})`;
      }
    }

    return {
      message: `Expenses retrieved successfully${searchInfo}`,
      data: expenses,
      total,
    };
  }

  async findOne(id: number) {
    const expense = await (this.prisma as any).expense.findUniqueOrThrow({
      where: { id },
      include: {
        activity: {
          include: {
            approvers: true,
            supervisor: {
              include: {
                account: {
                  select: {
                    id: true,
                    name: true,
                    phone: true,
                    dob: true,
                  },
                },
                membershipPositions: true,
              },
            },
            location: true,
          },
        },
      },
    });
    return {
      message: 'Expense retrieved successfully',
      data: expense,
    };
  }

  async remove(id: number) {
    await (this.prisma as any).expense.delete({
      where: { id },
    });
    return {
      message: 'Expense deleted successfully',
    };
  }

  async create(createExpenseDto: any): Promise<{ message: string; data: any }> {
    const expense = await (this.prisma as any).expense.create({
      data: createExpenseDto,
      include: {
        activity: true,
      },
    });
    return {
      message: 'Expense created successfully',
      data: expense,
    };
  }

  async update(
    id: number,
    updateExpenseDto: any,
  ): Promise<{ message: string; data: any }> {
    const expense = await (this.prisma as any).expense.update({
      where: { id },
      data: updateExpenseDto,
    });
    return {
      message: 'Expense updated successfully',
      data: expense,
    };
  }
}
