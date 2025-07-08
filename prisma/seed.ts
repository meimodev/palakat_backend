import { PrismaClient, Gender, Bipra, ActivityType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  if (
    !['localhost', '127.0.0.1'].some((host) =>
      process.env.DATABASE_POSTGRES_URL?.includes(host),
    )
  ) {
    console.error('❌ Seeding is only allowed on local environments.');
    process.exit(1);
  }

  console.log('🌱 Starting seed...');
  await prisma.activity.deleteMany();
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
        create: [{ name: 'Kolom Keluarga' }, { name: 'Kolom Single' }],
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

  // 4. Create Activities
  const activities = await Promise.all([
    // Activities for John Doe (membership[0])
    prisma.activity.create({
      data: {
        membershipId: memberships[0].id,
        bipra: Bipra.JMT,
        title: 'Kebaktian Minggu Pagi',
        location: 'Sanctuary Utama',
        latitude: '-6.2615',
        longitude: '106.7837',
        date: new Date('2025-07-13T08:00:00Z'),
        note: 'Kebaktian minggu dengan tema "Kasih yang Sejati"',
        activityType: ActivityType.SERVICE,
      },
    }),
    prisma.activity.create({
      data: {
        membershipId: memberships[0].id,
        bipra: Bipra.PKB,
        title: 'Retreat Kolom Dewasa',
        location: 'Puncak Resort',
        latitude: '-6.7000',
        longitude: '107.0000',
        date: new Date('2025-07-20T06:00:00Z'),
        note: 'Retreat 2 hari 1 malam untuk penguatan iman',
        activityType: ActivityType.EVENT,
      },
    }),

    // Activities for Jane Smith (membership[1])
    prisma.activity.create({
      data: {
        membershipId: memberships[1].id,
        bipra: Bipra.WKI,
        title: 'Pengumuman Persiapan Sidi',
        location: 'Ruang Serbaguna',
        date: new Date('2025-07-15T19:00:00Z'),
        note: 'Informasi tentang kelas persiapan sidi untuk yang belum sidi',
        activityType: ActivityType.ANNOUNCEMENT,
      },
    }),
    prisma.activity.create({
      data: {
        membershipId: memberships[1].id,
        bipra: Bipra.PMD,
        title: 'Bible Study Pemuda',
        location: 'Ruang Pemuda',
        latitude: '-6.1751',
        longitude: '106.8650',
        date: new Date('2025-07-16T19:30:00Z'),
        note: 'Pembahasan Kitab Roma pasal 8',
        activityType: ActivityType.SERVICE,
      },
    }),

    // Activities for Michael Johnson (membership[2])
    prisma.activity.create({
      data: {
        membershipId: memberships[2].id,
        bipra: Bipra.RMJ,
        title: 'Seminar Kepemimpinan Kristiani',
        location: 'Auditorium',
        latitude: '-6.1279',
        longitude: '106.7980',
        date: new Date('2025-07-19T09:00:00Z'),
        note: 'Seminar untuk para profesional Kristen',
        fileUrl: 'https://example.com/seminar-leadership.pdf',
        activityType: ActivityType.EVENT,
      },
    }),
    prisma.activity.create({
      data: {
        membershipId: memberships[2].id,
        bipra: Bipra.ASM,
        title: 'Doa Syafaat Pagi',
        location: 'Kapel Doa',
        date: new Date('2025-07-14T05:30:00Z'),
        note: 'Doa bersama untuk keluarga dan pekerjaan',
        activityType: ActivityType.SERVICE,
      },
    }),

    // Activities for Sarah Wilson (membership[3])
    prisma.activity.create({
      data: {
        membershipId: memberships[3].id,
        bipra: Bipra.JMT,
        title: 'Outreach Pemuda',
        location: 'Taman Kota',
        latitude: '-6.2000',
        longitude: '106.8000',
        date: new Date('2025-07-21T14:00:00Z'),
        note: 'Kegiatan pelayanan sosial untuk anak jalanan',
        activityType: ActivityType.EVENT,
      },
    }),
    prisma.activity.create({
      data: {
        membershipId: memberships[3].id,
        bipra: Bipra.WKI,
        title: 'Pengumuman Acara Natal Pemuda',
        date: new Date('2025-07-18T20:00:00Z'),
        note: 'Informasi persiapan perayaan Natal untuk pemuda',
        activityType: ActivityType.ANNOUNCEMENT,
      },
    }),

    // Activities for David Brown (membership[4])
    prisma.activity.create({
      data: {
        membershipId: memberships[4].id,
        bipra: Bipra.PKB,
        title: 'Kebaktian Keluarga',
        location: 'Ruang Keluarga',
        latitude: '-6.1751',
        longitude: '106.8650',
        date: new Date('2025-07-17T18:00:00Z'),
        note: 'Kebaktian khusus untuk keluarga muda',
        activityType: ActivityType.SERVICE,
      },
    }),
    prisma.activity.create({
      data: {
        membershipId: memberships[4].id,
        bipra: Bipra.PMD,
        title: 'Workshop Parenting Kristen',
        location: 'Ruang Seminar',
        date: new Date('2025-07-22T10:00:00Z'),
        note: 'Workshop untuk orangtua dalam mendidik anak secara Kristiani',
        fileUrl: 'https://example.com/parenting-workshop.pdf',
        activityType: ActivityType.EVENT,
      },
    }),
  ]);

  console.log(`✅ Created ${activities.length} activities`);

  // Display available accounts without membership
  const accountsWithoutMembership = await prisma.account.findMany({
    where: {
      membership: null,
    },
  });

  console.log(
    `\n👤 Accounts available for new memberships (${accountsWithoutMembership.length}):`,
  );
  accountsWithoutMembership.forEach((account) => {
    console.log(
      `   - ID: ${account.id}, Name: ${account.name}, Phone: ${account.phone}`,
    );
  });

  // 5. Display summary
  console.log('\n📊 Seed Summary:');
  console.log('================');

  const allChurches = await prisma.church.findMany({
    include: {
      columns: true,
      memberships: {
        include: {
          account: true,
          column: true,
          activities: true,
        },
      },
    },
  });

  allChurches.forEach((church) => {
    console.log(`\n🏛️  ${church.name}`);
    console.log(`   📍 ${church.address}`);
    console.log(
      `   📊 Columns: ${church.columns.map((c) => c.name).join(', ')}`,
    );
    console.log(`   👥 Members: ${church.memberships.length}`);

    church.memberships.forEach((membership) => {
      console.log(
        `      - ${membership.account.name} (${membership.column.name}) - Baptize: ${membership.baptize}, Sidi: ${membership.sidi}`,
      );
      console.log(`        📅 Activities: ${membership.activities.length}`);
      membership.activities.forEach((activity) => {
        const dateStr = activity.date ? activity.date.toLocaleDateString() : 'No date';
        console.log(`           • ${activity.title} (${activity.activityType}) - ${dateStr}`);
      });
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
