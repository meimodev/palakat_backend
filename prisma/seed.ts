import {
  PrismaClient,
  Gender,
  Bipra,
  ActivityType,
  Book,
  MaritalStatus,
} from '@prisma/client';
import * as process from 'node:process';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Generate a numeric-only phone number starting with 0, length 12–13
function generateNumericPhoneNumber(): string {
  const length = Math.random() < 0.5 ? 12 : 13;
  let result = '0';
  for (let i = 1; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

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
    await prisma.$transaction([
      prisma.approver.deleteMany(),
      prisma.activity.deleteMany(),
      prisma.songPart.deleteMany(),
      prisma.song.deleteMany(),
      prisma.membershipPosition.deleteMany(),
      prisma.membership.deleteMany(),
      prisma.column.deleteMany(),
      prisma.church.deleteMany(),
      prisma.account.deleteMany(),
      prisma.location.deleteMany(),
    ]);
    console.log('🧹 Cleaned existing data...');
  } catch (e) {
    console.log('🧹Error while cleaning the current data... ', e);
  }

  // 1. Create Accounts
  const defaultPasswordHash = await bcrypt.hash('password', 12);
  const accounts = await Promise.all([
    prisma.account.create({
      data: {
        name: 'John Doe',
        phone: '081234567890',
        email: 'john.doe@example.com',
        passwordHash: defaultPasswordHash,
        claimed: false,
        gender: Gender.MALE,
        maritalStatus: MaritalStatus.MARRIED,
        dob: new Date('1990-01-01'),
      } as any,
    }),
    prisma.account.create({
      data: {
        name: 'Jane Smith',
        phone: '081234567891',
        email: 'jane.smith@example.com',
        passwordHash: defaultPasswordHash,
        claimed: false,
        gender: Gender.FEMALE,
        maritalStatus: MaritalStatus.SINGLE,
        dob: new Date('1980-01-01'),
      } as any,
    }),
    prisma.account.create({
      data: {
        name: 'Michael Johnson',
        phone: '081234567892',
        passwordHash: defaultPasswordHash,
        claimed: false,
        gender: Gender.MALE,
        maritalStatus: MaritalStatus.MARRIED,
        dob: new Date('1960-01-01'),
      } as any,
    }),
    prisma.account.create({
      data: {
        name: 'Sarah Wilson',
        phone: '081234567893',
        passwordHash: defaultPasswordHash,
        claimed: false,
        gender: Gender.FEMALE,
        maritalStatus: MaritalStatus.MARRIED,
        dob: new Date('1997-01-01'),
      } as any,
    }),
    prisma.account.create({
      data: {
        name: 'David Brown',
        phone: '081234567894',
        passwordHash: defaultPasswordHash,
        claimed: false,
        gender: Gender.MALE,
        maritalStatus: MaritalStatus.SINGLE,
        dob: new Date('2000-01-01'),
      } as any,
    }),
    // Additional accounts without membership
    prisma.account.create({
      data: {
        name: 'Lisa Anderson',
        phone: '081234567895',
        passwordHash: defaultPasswordHash,
        claimed: false,
        gender: Gender.FEMALE,
        maritalStatus: MaritalStatus.MARRIED,
        dob: new Date('2000-01-01'),
      } as any,
    }),
    prisma.account.create({
      data: {
        name: 'Robert Taylor',
        phone: '081234567896',
        passwordHash: defaultPasswordHash,
        claimed: false,
        gender: Gender.MALE,
        maritalStatus: MaritalStatus.SINGLE,
        dob: new Date('2000-01-01'),
      } as any,
    }),
    prisma.account.create({
      data: {
        name: 'Maria Garcia',
        phone: '081234567897',
        passwordHash: defaultPasswordHash,
        claimed: false,
        gender: Gender.FEMALE,
        maritalStatus: MaritalStatus.MARRIED,
        dob: new Date('2000-01-01'),
      } as any,
    }),
    prisma.account.create({
      data: {
        name: 'Kevin Lee',
        phone: '081234567898',
        passwordHash: defaultPasswordHash,
        claimed: false,
        gender: Gender.MALE,
        maritalStatus: MaritalStatus.SINGLE,
        dob: new Date('2000-01-01'),
      } as any,
    }),
    prisma.account.create({
      data: {
        name: 'Emma Davis',
        phone: '081234567899',
        passwordHash: defaultPasswordHash,
        claimed: false,
        gender: Gender.FEMALE,
        maritalStatus: MaritalStatus.SINGLE,
        dob: new Date('2000-01-01'),
      } as any,
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

  // removed streets since address field is removed

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
    const columns = columnTypes[i % columnTypes.length];

    const latitude = parseFloat((-6.0 - Math.random() * 0.5).toFixed(4));
    const longitude = parseFloat((106.5 + Math.random() * 0.5).toFixed(4));

    const church = await prisma.church.create({
      data: {
        name: name,
        phoneNumber: Math.random() < 0.6 ? generateNumericPhoneNumber() : null,
        email:
          Math.random() < 0.6
            ? `${name.toLowerCase().replace(/\s+/g, '-')}${i + 1}@example.com`
            : null,
        description:
          Math.random() < 0.6
            ? `Gereja ${name} yang terletak di ${area}.`
            : null,
        location: {
          create: {
            name: `Lokasi ${name}`,
            latitude,
            longitude,
          },
        },
        columns: {
          create: columns.map((col) => ({ name: col })),
        },
      } as any,
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

  // 3.a Create Membership Positions linked to memberships
  const membershipPositions = await Promise.all([
    prisma.membershipPosition.create({
      data: {
        membership: { connect: { id: memberships[0].id } },
        name: 'Penatua PKB',
        church: { connect: { id: memberships[0].churchId } },
      } as any,
    }),
    prisma.membershipPosition.create({
      data: {
        membership: { connect: { id: memberships[0].id } },
        name: 'Penatua Kolom 1',
        church: { connect: { id: memberships[0].churchId } },
      } as any,
    }),
    prisma.membershipPosition.create({
      data: {
        membership: { connect: { id: memberships[0].id } },
        name: 'Wakil Ketua',
        church: { connect: { id: memberships[0].churchId } },
      } as any,
    }),
    prisma.membershipPosition.create({
      data: {
        membership: { connect: { id: memberships[1].id } },
        name: 'Sekretaris',
        church: { connect: { id: memberships[1].churchId } },
      } as any,
    }),
    prisma.membershipPosition.create({
      data: {
        membership: { connect: { id: memberships[2].id } },
        name: 'Bendahara',
        church: { connect: { id: memberships[2].churchId } },
      } as any,
    }),
    prisma.membershipPosition.create({
      data: {
        membership: { connect: { id: memberships[3].id } },
        name: 'Anggota',
        church: { connect: { id: memberships[3].churchId } },
      } as any,
    }),
    prisma.membershipPosition.create({
      data: {
        membership: { connect: { id: memberships[3].id } },
        name: 'Penatua Anak',
        church: { connect: { id: memberships[3].churchId } },
      } as any,
    }),
  ]);

  console.log(`✅ Created ${membershipPositions.length} membership positions`);

  // 3.b Create 20 additional accounts with memberships all in the first church
  const extraAccounts = await Promise.all(
    Array.from({ length: 20 }).map((_, idx) =>
      prisma.account.create({
        data: {
          name: `Seed User ${idx + 1}`,
          phone: generateNumericPhoneNumber(),
          passwordHash: defaultPasswordHash,
          claimed: false,
          gender: Math.random() < 0.5 ? Gender.MALE : Gender.FEMALE,
          maritalStatus: Math.random() < 0.5 ? MaritalStatus.MARRIED : MaritalStatus.SINGLE,
          dob: new Date(
            1980 + Math.floor(Math.random() * 25),
            Math.floor(Math.random() * 12),
            1 + Math.floor(Math.random() * 28),
          ),
        } as any,
      }),
    ),
  );

  // Attach memberships for the 20 extra accounts to church id 1 (first created church)
  const extraMemberships = await Promise.all(
    extraAccounts.map((acc, idx) => {
      const firstChurch = churches[0];
      const targetColumn =
        firstChurch.columns[idx % firstChurch.columns.length];
      return prisma.membership.create({
        data: {
          accountId: acc.id,
          churchId: firstChurch.id,
          columnId: targetColumn.id,
          baptize: Math.random() < 0.7,
          sidi: Math.random() < 0.6,
        },
      });
    }),
  );

  // Merge into existing arrays for accurate summary
  accounts.push(...extraAccounts);
  memberships.push(...extraMemberships);

  console.log(
    `✅ Created ${extraAccounts.length} additional accounts with memberships in church ID ${churches[0].id}`,
  );

  // 4. Create Activities (supervisor is the creator/owner; approver optional)
  const activities = await Promise.all([
    // Activities for John Doe (membership[0])
    prisma.activity.create({
      data: {
        supervisor: { connect: { id: memberships[0].id } },
        bipra: Bipra.WKI,
        title: 'Kebaktian Minggu Pagi',
        location: {
          create: {
            name: 'Sanctuary Utama',
            latitude: -6.2615,
            longitude: 106.7837,
          },
        },
        date: new Date('2025-07-13T08:00:00Z'),
        note: 'Kebaktian minggu dengan tema "Kasih yang Sejati"',
        activityType: ActivityType.SERVICE,
      },
    }),
    prisma.activity.create({
      data: {
        supervisor: { connect: { id: memberships[0].id } },
        bipra: Bipra.PKB,
        title: 'Retreat Kolom Dewasa',
        location: {
          create: {
            name: 'Puncak Resort',
            latitude: -6.7,
            longitude: 107.0,
          },
        },
        date: new Date('2025-07-20T06:00:00Z'),
        note: 'Retreat 2 hari 1 malam untuk penguatan iman',
        activityType: ActivityType.EVENT,
      },
    }),

    // Activities for Jane Smith (membership[1])
    prisma.activity.create({
      data: {
        supervisor: { connect: { id: memberships[1].id } },
        bipra: Bipra.WKI,
        title: 'Pengumuman Persiapan Sidi',
        // no location for this activity
        date: new Date('2025-07-15T19:00:00Z'),
        note: 'Informasi tentang kelas persiapan sidi untuk yang belum sidi',
        activityType: ActivityType.ANNOUNCEMENT,
      },
    }),
    prisma.activity.create({
      data: {
        supervisor: { connect: { id: memberships[1].id } },
        bipra: Bipra.PMD,
        title: 'Bible Study Pemuda',
        location: {
          create: {
            name: 'Ruang Pemuda',
            latitude: -6.1751,
            longitude: 106.865,
          },
        },
        date: new Date('2025-07-16T19:30:00Z'),
        note: 'Pembahasan Kitab Roma pasal 8',
        activityType: ActivityType.SERVICE,
      },
    }),

    // Activities for Michael Johnson (membership[2])
    prisma.activity.create({
      data: {
        supervisor: { connect: { id: memberships[2].id } },
        bipra: Bipra.RMJ,
        title: 'Seminar Kepemimpinan Kristiani',
        location: {
          create: {
            name: 'Auditorium',
            latitude: -6.1279,
            longitude: 106.798,
          },
        },
        date: new Date('2025-07-19T09:00:00Z'),
        note: 'Seminar untuk para profesional Kristen',
        fileUrl: 'https://example.com/seminar-leadership.pdf',
        activityType: ActivityType.EVENT,
      },
    }),
    prisma.activity.create({
      data: {
        supervisor: { connect: { id: memberships[2].id } },
        bipra: Bipra.ASM,
        title: 'Doa Syafaat Pagi',
        // no location for this activity
        date: new Date('2025-07-14T05:30:00Z'),
        note: 'Doa bersama untuk keluarga dan pekerjaan',
        activityType: ActivityType.SERVICE,
      },
    }),

    // Activities for Sarah Wilson (membership[3])
    prisma.activity.create({
      data: {
        supervisor: { connect: { id: memberships[3].id } },
        bipra: Bipra.PMD,
        title: 'Outreach Pemuda',
        location: {
          create: {
            name: 'Taman Kota',
            latitude: -6.2,
            longitude: 106.8,
          },
        },
        date: new Date('2025-07-21T14:00:00Z'),
        note: 'Kegiatan pelayanan sosial untuk anak jalanan',
        activityType: ActivityType.EVENT,
      },
    }),
    prisma.activity.create({
      data: {
        supervisor: { connect: { id: memberships[3].id } },
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
        supervisor: { connect: { id: memberships[4].id } },
        bipra: Bipra.PKB,
        title: 'Kebaktian Keluarga',
        location: {
          create: {
            name: 'Ruang Keluarga',
            latitude: -6.1751,
            longitude: 106.865,
          },
        },
        date: new Date('2025-07-17T18:00:00Z'),
        note: 'Kebaktian khusus untuk keluarga muda',
        activityType: ActivityType.SERVICE,
      },
    }),
    prisma.activity.create({
      data: {
        supervisor: { connect: { id: memberships[4].id } },
        bipra: Bipra.PMD,
        title: 'Workshop Parenting Kristen',
        location: {
          create: {
            name: 'Ruang Seminar',
            latitude: -6.18,
            longitude: 106.84,
          },
        },
        date: new Date('2025-07-22T10:00:00Z'),
        note: 'Workshop untuk orangtua dalam mendidik anak secara Kristiani',
        fileUrl: 'https://example.com/parenting-workshop.pdf',
        activityType: ActivityType.EVENT,
      },
    }),
  ]);

  console.log(`✅ Created ${activities.length} activities`);

  // Create approvers after activities
  await prisma.approver.createMany({
    data: [
      {
        activityId: activities[0].id,
        membershipId: memberships[2].id,
        status: 'UNCONFIRMED',
      },
      {
        activityId: activities[2].id,
        membershipId: memberships[0].id,
        status: 'APPROVED',
      },
      {
        activityId: activities[5].id,
        membershipId: memberships[1].id,
        status: 'UNCONFIRMED',
      },
      {
        activityId: activities[7].id,
        membershipId: memberships[0].id,
        status: 'REJECTED',
      },
      {
        activityId: activities[9].id,
        membershipId: memberships[2].id,
        status: 'UNCONFIRMED',
      },
    ],
    skipDuplicates: true,
  });

  const songs = await Promise.all([
    prisma.song.create({
      data: {
        title: 'Amazing Grace',
        index: 22,
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
        index: 4,
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
      membership: { is: null },
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
