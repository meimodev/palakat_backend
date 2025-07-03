import { PrismaClient, Gender } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  if (!['localhost', '127.0.0.1'].some((host) => process.env.DATABASE_URL?.includes(host))) {
    console.error('❌ Seeding is only allowed on local environments.');
    process.exit(1);
  }

  console.log('🌱 Starting seed...');
  await prisma.membership.deleteMany();
  await prisma.column.deleteMany();
  await prisma.church.deleteMany();
  await prisma.account.deleteMany();
  
  console.log('🧹 Cleaned existing data...');

  // 1. Create Accounts
  const accounts = await Promise.all([
    prisma.account.create({
      data: {
        name: 'John Doe',
        phone: '081234567890',
        gender: Gender.MALE,
        married: true,
      },
    }),
    prisma.account.create({
      data: {
        name: 'Jane Smith',
        phone: '081234567891',
        gender: Gender.FEMALE,
        married: false,
      },
    }),
    prisma.account.create({
      data: {
        name: 'Michael Johnson',
        phone: '081234567892',
        gender: Gender.MALE,
        married: true,
      },
    }),
    prisma.account.create({
      data: {
        name: 'Sarah Wilson',
        phone: '081234567893',
        gender: Gender.FEMALE,
        married: true,
      },
    }),
    prisma.account.create({
      data: {
        name: 'David Brown',
        phone: '081234567894',
        gender: Gender.MALE,
        married: false,
      },
    }),
    // Additional accounts without membership
    prisma.account.create({
      data: {
        name: 'Lisa Anderson',
        phone: '081234567895',
        gender: Gender.FEMALE,
        married: true,
      },
    }),
    prisma.account.create({
      data: {
        name: 'Robert Taylor',
        phone: '081234567896',
        gender: Gender.MALE,
        married: false,
      },
    }),
    prisma.account.create({
      data: {
        name: 'Maria Garcia',
        phone: '081234567897',
        gender: Gender.FEMALE,
        married: true,
      },
    }),
    prisma.account.create({
      data: {
        name: 'Kevin Lee',
        phone: '081234567898',
        gender: Gender.MALE,
        married: false,
      },
    }),
    prisma.account.create({
      data: {
        name: 'Emma Davis',
        phone: '081234567899',
        gender: Gender.FEMALE,
        married: false,
      },
    }),
  ]);

  console.log(`✅ Created ${accounts.length} accounts`);

  // 2. Create Churches with Columns
  const church1 = await prisma.church.create({
    data: {
      name: 'GKI Pondok Indah',
      latitude: '-6.2615',
      longitude: '106.7837',
      address: 'Jl. Metro Pondok Indah, Jakarta Selatan',
      columns: {
        create: [
          { name: 'Kolom Dewasa' },
          { name: 'Kolom Pemuda' },
          { name: 'Kolom Anak-anak' },
        ],
      },
    },
    include: { columns: true },
  });

  const church2 = await prisma.church.create({
    data: {
      name: 'GPIB Immanuel',
      latitude: '-6.1751',
      longitude: '106.8650',
      address: 'Jl. Medan Merdeka Timur, Jakarta Pusat',
      columns: {
        create: [
          { name: 'Kolom Keluarga' },
          { name: 'Kolom Single' },
        ],
      },
    },
    include: { columns: true },
  });

  const church3 = await prisma.church.create({
    data: {
      name: 'GKI Pluit',
      latitude: '-6.1279',
      longitude: '106.7980',
      address: 'Jl. Pluit Indah Raya, Jakarta Utara',
      columns: {
        create: [
          { name: 'Kolom Profesional' },
          { name: 'Kolom Ibu-ibu' },
          { name: 'Kolom Bapak-bapak' },
        ],
      },
    },
    include: { columns: true },
  });

  console.log('✅ Created 3 churches with columns');

  // 3. Create Memberships
  const memberships = await Promise.all([
    // John Doe -> GKI Pondok Indah, Kolom Dewasa
    prisma.membership.create({
      data: {
        accountId: accounts[0].id,
        churchId: church1.id,
        columnId: church1.columns[0].id, // Kolom Dewasa
        baptize: true,
        sidi: true,
      },
    }),
    
    // Jane Smith -> GPIB Immanuel, Kolom Single
    prisma.membership.create({
      data: {
        accountId: accounts[1].id,
        churchId: church2.id,
        columnId: church2.columns[1].id, // Kolom Single
        baptize: true,
        sidi: false,
      },
    }),
    
    // Michael Johnson -> GKI Pluit, Kolom Profesional
    prisma.membership.create({
      data: {
        accountId: accounts[2].id,
        churchId: church3.id,
        columnId: church3.columns[0].id, // Kolom Profesional
        baptize: true,
        sidi: true,
      },
    }),
    
    // Sarah Wilson -> GKI Pondok Indah, Kolom Pemuda
    prisma.membership.create({
      data: {
        accountId: accounts[3].id,
        churchId: church1.id,
        columnId: church1.columns[1].id, // Kolom Pemuda
        baptize: false,
        sidi: false,
      },
    }),
    
    // David Brown -> GPIB Immanuel, Kolom Keluarga
    prisma.membership.create({
      data: {
        accountId: accounts[4].id,
        churchId: church2.id,
        columnId: church2.columns[0].id, // Kolom Keluarga
        baptize: true,
        sidi: false,
      },
    }),
  ]);

  console.log(`✅ Created ${memberships.length} memberships`);

  // Display available accounts without membership
  const accountsWithoutMembership = await prisma.account.findMany({
    where: {
      membership: null
    }
  });

  console.log(`\n👤 Accounts available for new memberships (${accountsWithoutMembership.length}):`);
  accountsWithoutMembership.forEach((account) => {
    console.log(`   - ID: ${account.id}, Name: ${account.name}, Phone: ${account.phone}`);
  });

  // 4. Display summary
  console.log('\n📊 Seed Summary:');
  console.log('================');
  
  const allChurches = await prisma.church.findMany({
    include: {
      columns: true,
      memberships: {
        include: {
          account: true,
          column: true,
        },
      },
    },
  });

  allChurches.forEach((church) => {
    console.log(`\n🏛️  ${church.name}`);
    console.log(`   📍 ${church.address}`);
    console.log(`   📊 Columns: ${church.columns.map(c => c.name).join(', ')}`);
    console.log(`   👥 Members: ${church.memberships.length}`);
    
    church.memberships.forEach((membership) => {
      console.log(`      - ${membership.account.name} (${membership.column.name}) - Baptize: ${membership.baptize}, Sidi: ${membership.sidi}`);
    });
  });

  console.log('\n🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });