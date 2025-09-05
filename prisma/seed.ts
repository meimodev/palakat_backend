import {
  PrismaClient,
  Gender,
  Bipra,
  ActivityType,
  Book,
} from '@prisma/client';
import * as process from 'node:process';

const prisma = new PrismaClient();

async function main() {
  const inServerEnvironment = !['localhost', '127.0.0.1'].some((host) =>
    process.env.DATABASE_POSTGRES_URL?.includes(host),
  );
  const forceSeeding = process.env.FORCE_SEEDING == 'true';
  if (inServerEnvironment) {
    if (forceSeeding) {
      console.error(
        ' ⚠️⚠️⚠️ Force seeding!. hope you know what will happened ⚠️⚠️⚠️',
      );
    } else {
      console.error('❌ Seeding is only allowed on local environments.');
      process.exit(0);
    }
  }
  console.log('🌱 Starting seed...');
  try {
    await prisma.activity.deleteMany();
    await prisma.membership.deleteMany();
    await prisma.column.deleteMany();
    await prisma.church.deleteMany();
    await prisma.account.deleteMany();
    console.log('🧹 Cleaned existing data...');
  } catch (e) {
    console.log('🧹Error while cleaning the current data... ', e);
  }

  // 1. Create Accounts
  const accounts = await Promise.all([
    prisma.account.create({
      data: {
        name: 'John Doe',
        phone: '081234567890',
        gender: Gender.MALE,
        married: true,
        dob: new Date('1990-01-01'),
        membershipId: 5,
      },
    }),
    prisma.account.create({
      data: {
        name: 'Jane Smith',
        phone: '081234567891',
        gender: Gender.FEMALE,
        married: false,
        dob: new Date('1980-01-01'),
        membershipId: 4,
      },
    }),
    prisma.account.create({
      data: {
        name: 'Michael Johnson',
        phone: '081234567892',
        gender: Gender.MALE,
        married: true,
        dob: new Date('1960-01-01'),
        membershipId: 2,
      },
    }),
    prisma.account.create({
      data: {
        name: 'Sarah Wilson',
        phone: '081234567893',
        gender: Gender.FEMALE,
        married: true,
        dob: new Date('1997-01-01'),
        membershipId: 1,
      },
    }),
    prisma.account.create({
      data: {
        name: 'David Brown',
        phone: '081234567894',
        gender: Gender.MALE,
        married: false,
        dob: new Date('2000-01-01'),
        membershipId: 3,
      },
    }),
    // Additional accounts without membership
    prisma.account.create({
      data: {
        name: 'Lisa Anderson',
        phone: '081234567895',
        gender: Gender.FEMALE,
        married: true,
        dob: new Date('2000-01-01'),
      },
    }),
    prisma.account.create({
      data: {
        name: 'Robert Taylor',
        phone: '081234567896',
        gender: Gender.MALE,
        married: false,
        dob: new Date('2000-01-01'),
      },
    }),
    prisma.account.create({
      data: {
        name: 'Maria Garcia',
        phone: '081234567897',
        gender: Gender.FEMALE,
        married: true,
        dob: new Date('2000-01-01'),
      },
    }),
    prisma.account.create({
      data: {
        name: 'Kevin Lee',
        phone: '081234567898',
        gender: Gender.MALE,
        married: false,
        dob: new Date('2000-01-01'),
      },
    }),
    prisma.account.create({
      data: {
        name: 'Emma Davis',
        phone: '081234567899',
        gender: Gender.FEMALE,
        married: false,
        dob: new Date('2000-01-01'),
      },
    }),
  ]);

  console.log(`✅ Created ${accounts.length} accounts`);

  // 2. Create Churches with Columns (100 churches)
  const churchNames = [
    'GKI Pondok Indah',
    'GPIB Immanuel',
    'GKI Pluit',
    'GBKP Jakarta',
    'GPIB Effatha',
    'GKI Kelapa Gading',
    'GPIB Bethel',
    'GKI Cawang',
    'GPIB Paulus',
    'GKI Tanjung Duren',
    'GBKP Cawang',
    'GPIB Gloria',
    'GKI Modernland',
    'GBKP Kelapa Gading',
    'GPIB Bethany',
    'GKI PIK',
    'GPIB Shekinah',
    'GKI Bintaro',
    'GBKP Jakarta Timur',
    'GPIB Hosanna',
    'GKI Bekasi',
    'GPIB Emmanuel',
    'GKI Tangerang',
    'GBKP Bekasi',
    'GPIB Zion',
    'GKI Bogor',
    'GPIB Getsemani',
    'GKI Depok',
    'GBKP Depok',
    'GPIB Shalom',
    'GKI Serpong',
    'GPIB Yerusalem',
    'GKI Cikarang',
    'GBKP Cikarang',
    'GPIB Galilea',
    'GKI Karawaci',
    'GPIB Nazaret',
    'GKI Lippo',
    'GBKP Tangerang',
    'GPIB Kanaan',
    'GKI Sentul',
    'GPIB Mahanaim',
    'GKI Cibubur',
    'GBKP Bogor',
    'GPIB Philadelphia',
    'GKI BSD',
    'GPIB Hermon',
    'GKI Cinere',
    'GBKP Sentul',
    'GPIB Sion',
    'GKI Kemang',
    'GPIB Karmel',
    'GKI Sudirman',
    'GBKP Kemang',
    'GPIB Horeb',
    'GKI Menteng',
    'GPIB Bethesda',
    'GKI Cikini',
    'GBKP Menteng',
    'GPIB Salem',
    'GKI Matraman',
    'GPIB Galilee',
    'GKI Rawamangun',
    'GBKP Rawamangun',
    'GPIB Sinai',
    'GKI Duren Sawit',
    'GPIB Efrata',
    'GKI Klender',
    'GBKP Klender',
    'GPIB Bethel Baru',
    'GKI Jatinegara',
    'GPIB Kana',
    'GKI Cakung',
    'GBKP Cakung',
    'GPIB Moria',
    'GKI Pulogadung',
    'GPIB Ebenhaezer',
    'GKI Kramat Jati',
    'GBKP Kramat Jati',
    'GPIB Gibeon',
    'GKI Pasar Rebo',
    'GPIB Antiokia',
    'GKI Cipayung',
    'GBKP Cipayung',
    'GPIB Bethania',
    'GKI Ciracas',
    'GPIB Mahkota',
    'GKI Condet',
    'GBKP Condet',
    'GPIB Pniel',
    'GKI Makasar',
    'GPIB Betel',
    'GKI Halim',
    'GBKP Halim',
    'GPIB Tabor',
    'GKI Tebet',
    'GPIB Filadelfia',
    'GKI Setiabudi',
    'GBKP Setiabudi',
    'GPIB Kapernaum',
    'GKI Mampang',
    'GPIB Betlehem',
    'GKI Pancoran',
    'GBKP Pancoran',
    'GPIB Siloam',
    'GKI Pasar Minggu',
    'GPIB Bethsaida',
    'GKI Jagakarsa',
    'GBKP Jagakarsa',
    'GPIB Eden',
  ];

  const areas = [
    'Jakarta Selatan',
    'Jakarta Pusat',
    'Jakarta Utara',
    'Jakarta Timur',
    'Jakarta Barat',
    'Bekasi',
    'Tangerang',
    'Depok',
    'Bogor',
    'Tangerang Selatan',
  ];

  const streets = [
    'Jl. Sudirman',
    'Jl. Thamrin',
    'Jl. Gatot Subroto',
    'Jl. Kuningan',
    'Jl. Senayan',
    'Jl. Kemang Raya',
    'Jl. Radio Dalam',
    'Jl. Fatmawati',
    'Jl. TB Simatupang',
    'Jl. Ampera',
    'Jl. Pahlawan',
    'Jl. Veteran',
    'Jl. Diponegoro',
    'Jl. Imam Bonjol',
    'Jl. Cut Meutia',
    'Jl. Menteng Raya',
    'Jl. Cikini',
    'Jl. Salemba',
    'Jl. Matraman',
    'Jl. Senen',
    'Jl. Kelapa Gading',
    'Jl. Sunter',
    'Jl. Pluit',
    'Jl. Pantai Indah',
    'Jl. Ancol',
    'Jl. Cempaka Putih',
    'Jl. Kemayoran',
    'Jl. Tanjung Priok',
    'Jl. Kelapa Sawit',
    'Jl. Gading Serpong',
  ];

  const columnTypes = [
    ['Kolom Dewasa', 'Kolom Pemuda', 'Kolom Anak-anak'],
    ['Kolom Keluarga', 'Kolom Single'],
    ['Kolom Profesional', 'Kolom Ibu-ibu', 'Kolom Bapak-bapak'],
    ['Kolom Lansia', 'Kolom Dewasa Muda'],
    ['Kolom Keluarga Muda', 'Kolom Remaja'],
    ['Kolom Pria', 'Kolom Wanita', 'Kolom Campuran'],
  ];

  console.log('🏛️ Creating 100 churches...');

  const churches = [];
  for (let i = 0; i < 100; i++) {
    const name =
      churchNames[i % churchNames.length] +
      (i >= churchNames.length
        ? ` ${Math.floor(i / churchNames.length) + 1}`
        : '');
    const area = areas[i % areas.length];
    const street = streets[i % streets.length];
    const columns = columnTypes[i % columnTypes.length];

    // Generate coordinates around Jakarta area (-6.0 to -6.5 latitude, 106.5 to 107.0 longitude)
    const latitude = (-6.0 - Math.random() * 0.5).toFixed(4);
    const longitude = (106.5 + Math.random() * 0.5).toFixed(4);

    const church = await prisma.church.create({
      data: {
        name: name,
        latitude: latitude,
        longitude: longitude,
        address: `${street} No. ${Math.floor(Math.random() * 200) + 1}, ${area}`,
        columns: {
          create: columns.map((col) => ({ name: col })),
        },
      },
      include: { columns: true },
    });

    churches.push(church);

    if ((i + 1) % 20 === 0) {
      console.log(`   ✅ Created ${i + 1} churches...`);
    }
  }

  console.log(`✅ Created ${churches.length} churches with columns`);

  // 3. Create Memberships
  const memberships = await Promise.all([
    // John Doe -> First Church, First Column
    prisma.membership.create({
      data: {
        accountId: accounts[0].id,
        churchId: churches[0].id,
        columnId: churches[0].columns[0].id,
        baptize: true,
        sidi: true,
      },
    }),

    // Jane Smith -> Second Church, Second Column (or first if only one)
    prisma.membership.create({
      data: {
        accountId: accounts[1].id,
        churchId: churches[1].id,
        columnId: churches[1].columns[1]
          ? churches[1].columns[1].id
          : churches[1].columns[0].id,
        baptize: true,
        sidi: false,
      },
    }),

    // Michael Johnson -> Third Church, First Column
    prisma.membership.create({
      data: {
        accountId: accounts[2].id,
        churchId: churches[2].id,
        columnId: churches[2].columns[0].id,
        baptize: true,
        sidi: true,
      },
    }),

    // Sarah Wilson -> First Church, Second Column (or first if only one)
    prisma.membership.create({
      data: {
        accountId: accounts[3].id,
        churchId: churches[0].id,
        columnId: churches[0].columns[1]
          ? churches[0].columns[1].id
          : churches[0].columns[0].id,
        baptize: false,
        sidi: false,
      },
    }),

    // David Brown -> Second Church, First Column
    prisma.membership.create({
      data: {
        accountId: accounts[4].id,
        churchId: churches[1].id,
        columnId: churches[1].columns[0].id,
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
        bipra: Bipra.WKI,
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
        bipra: Bipra.PMD,
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

  const songs = await Promise.all([
    prisma.song.create({
      data: {
        title: 'Amazing Grace',
        index: 1,
        book: Book.NNBT,
        link: 'https://example.com/amazing-grace',
        parts: {
          create: [
            {
              index: 1,
              name: 'Verse 1',
              content:
                'Amazing grace! how sweet the sound\nThat saved a wretch like me!',
            },
            {
              index: 2,
              name: 'Chorus',
              content:
                'I once was lost, but now am found;\nWas blind, but now I see.',
            },
          ],
        },
      },
      include: { parts: true },
    }),
    prisma.song.create({
      data: {
        title: 'How Great Thou Art',
        index: 2,
        book: Book.NKB,
        link: 'https://example.com/how-great-thou-art',
        parts: {
          create: [
            {
              index: 1,
              name: 'Verse 1',
              content:
                'O Lord my God, when I in awesome wonder\nConsider all the worlds Thy Hands have made;',
            },
            {
              index: 2,
              name: 'Chorus',
              content:
                'Then sings my soul, My Saviour God, to Thee,\nHow great Thou art, how great Thou art!',
            },
          ],
        },
      },
      include: { parts: true },
    }),
  ]);

  console.log(`✅ Created ${songs.length} songs with parts`);

  console.log(`✅ Created ${activities.length} activities`);

  // 6. Display summary
  console.log('\n📊 Seed Summary:');
  console.log('================');
  console.log(`🏛️  Churches: ${churches.length}`);
  console.log(`👤 Accounts: ${accounts.length}`);
  console.log(`🤝 Memberships: ${memberships.length}`);
  console.log(`📅 Activities: ${activities.length}`);
  console.log(`🎵 Songs: ${songs.length}`);

  // Display accounts without membership
  const accountsWithoutMembership = await prisma.account.findMany({
    where: {
      membership: null,
    },
  });

  console.log(
    `\n👤 Accounts available for new memberships: ${accountsWithoutMembership.length}`,
  );

  // Display sample churches with most members
  const topChurches = await prisma.church.findMany({
    include: {
      _count: {
        select: {
          memberships: true,
          columns: true,
        },
      },
    },
    orderBy: {
      memberships: {
        _count: 'desc',
      },
    },
    take: 5,
  });

  console.log('\n🏆 Top 5 Churches by Member Count:');
  topChurches.forEach((church, index) => {
    console.log(
      `   ${index + 1}. ${church.name}: ${church._count.memberships} members, ${church._count.columns} columns`,
    );
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
