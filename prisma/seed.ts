import { PrismaClient, Gender } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Seed Church
    const church = await prisma.church.create({
        data: {
            name: 'Gereja GMIM Bethesda',
            latitude: '-1.465',
            longitude: '124.845',
            address: 'Jl. Sam Ratulangi No. 123',
        },
    });

    // Seed Columns
    const columnA = await prisma.column.create({
        data: {
            name: 'Kolom A',
            churchId: church.id,
        },
    });

    const columnB = await prisma.column.create({
        data: {
            name: 'Kolom B',
            churchId: church.id,
        },
    });

    // Seed Accounts
    const account1 = await prisma.account.create({
        data: {
            name: 'John Doe',
            phone: '081234567890',
            gender: Gender.MALE,
            married: false,
        },
    });

    const account2 = await prisma.account.create({
        data: {
            name: 'Jane Doe',
            phone: '081298765432',
            gender: Gender.FEMALE,
            married: true,
        },
    });

    // Seed Memberships
    await prisma.membership.create({
        data: {
            accountId: account1.id,
            columnId: columnA.id,
            churchId: church.id,
            baptize: true,
            sidi: false,
        },
    });

    await prisma.membership.create({
        data: {
            accountId: account2.id,
            columnId: columnB.id,
            churchId: church.id,
            baptize: true,
            sidi: true,
        },
    });

    console.log('✅ Seeder selesai!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
