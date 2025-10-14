import {
  PrismaClient,
  Gender,
  Bipra,
  ActivityType,
  Book,
  MaritalStatus,
  ApprovalStatus,
} from '@prisma/client';
import * as process from 'node:process';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
  churches: 10, // Minimal for variety coverage (6 column types)
  accountsPerChurch: 3,
  extraAccountsWithoutMembership: 5,
  activitiesPerChurch: 2,
  songsPerBook: 3,
  maxApproversPerActivity: 2,
  defaultPassword: 'password',
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function generateNumericPhoneNumber(): string {
  const length = Math.random() < 0.5 ? 12 : 13;
  let result = '08'; // Always start with 08
  for (let i = 2; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomBoolean(probability = 0.5): boolean {
  return Math.random() < probability;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function generateLatitude(): number {
  return parseFloat((-6.0 - Math.random() * 0.5).toFixed(4));
}

function generateLongitude(): number {
  return parseFloat((106.5 + Math.random() * 0.5).toFixed(4));
}

// ============================================================================
// DATA GENERATORS
// ============================================================================

const FIRST_NAMES = {
  MALE: [
    'John',
    'Michael',
    'David',
    'Robert',
    'Kevin',
    'Daniel',
    'Thomas',
    'James',
    'William',
    'Richard',
    'Budi',
    'Andi',
    'Agus',
    'Bambang',
    'Dedi',
  ],
  FEMALE: [
    'Jane',
    'Sarah',
    'Lisa',
    'Maria',
    'Emma',
    'Jennifer',
    'Michelle',
    'Patricia',
    'Linda',
    'Barbara',
    'Siti',
    'Dewi',
    'Ani',
    'Rina',
    'Lina',
  ],
};

const LAST_NAMES = [
  'Doe',
  'Smith',
  'Johnson',
  'Wilson',
  'Brown',
  'Anderson',
  'Taylor',
  'Garcia',
  'Lee',
  'Davis',
  'Santoso',
  'Wijaya',
  'Kusuma',
  'Pratama',
  'Setiawan',
];

const CHURCH_PREFIXES = [
  'GKI',
  'GPIB',
  'GBKP',
  'HKBP',
  'GBI',
  'GKPS',
  'GKPI',
  'GKPA',
];

const CHURCH_LOCATIONS = [
  'Pondok Indah',
  'Pluit',
  'Kelapa Gading',
  'Cawang',
  'Tanjung Duren',
  'Modernland',
  'PIK',
  'Bintaro',
  'Bekasi',
  'Tangerang',
];

const AREAS = [
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

const COLUMN_TYPES = [
  ['Kolom Dewasa', 'Kolom Pemuda', 'Kolom Anak-anak'],
  ['Kolom Keluarga', 'Kolom Single'],
  ['Kolom Profesional', 'Kolom Ibu-ibu', 'Kolom Bapak-bapak'],
  ['Kolom Lansia', 'Kolom Dewasa Muda'],
  ['Kolom Keluarga Muda', 'Kolom Remaja'],
  ['Kolom Pria', 'Kolom Wanita', 'Kolom Campuran'],
];

const POSITION_NAMES = [
  'Penatua PKB',
  'Penatua Kolom',
  'Wakil Ketua',
  'Sekretaris',
  'Bendahara',
  'Anggota Majelis',
  'Ketua Komisi',
  'Koordinator Ibadah',
  'Koordinator Pemuda',
  'Koordinator Anak',
  'Diaken',
  'Pengurus Harian',
];

const ACTIVITY_TITLES = {
  SERVICE: [
    'Kebaktian Minggu Pagi',
    'Kebaktian Sore',
    'Kebaktian Keluarga',
    'Doa Syafaat Pagi',
    'Bible Study',
    'Persekutuan Doa',
    'Kebaktian Pemuda',
    'Sekolah Minggu',
  ],
  EVENT: [
    'Retreat Kolom',
    'Seminar Kepemimpinan',
    'Workshop Parenting',
    'Outreach',
    'Bakti Sosial',
    'Konser Rohani',
    'Camp Pemuda',
    'Pelatihan Pelayanan',
  ],
  ANNOUNCEMENT: [
    'Pengumuman Persiapan Sidi',
    'Pengumuman Acara Natal',
    'Pengumuman Acara Paskah',
    'Pengumuman Rapat Majelis',
    'Pengumuman Kegiatan Kolom',
    'Pengumuman Bakti Sosial',
  ],
};

const SONG_TITLES = {
  NKB: [
    'Tuhan Allah Hadir',
    'Batu Penjuru',
    'Kar\'na Jemaat',
    'Yesus Kristus Jurus\'lamat',
    'Hai Umat, Nyanyilah',
  ],
  NNBT: [
    'Amazing Grace',
    'How Great Thou Art',
    'Holy Holy Holy',
    'What a Friend We Have in Jesus',
    'Great is Thy Faithfulness',
  ],
  KJ: [
    'Tuhan adalah Gembalaku',
    'Kasih Kristus yang Ajaib',
    'Kudengar Panggilan-Mu',
    'Yesus Sahabat Sejati',
    'Hatiku Bersukacita',
  ],
  DSL: [
    'Dia Sanggup',
    'Kasih-Mu Seperti Surga',
    'Ku Percaya Janjimu Tuhan',
    'S\'gala Kemuliaan',
    'Tuhan Setia',
  ],
};

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

function generateAccountData(index: number, gender?: Gender) {
  const accountGender = gender || randomElement([Gender.MALE, Gender.FEMALE]);
  const firstName = randomElement(FIRST_NAMES[accountGender]);
  const lastName = randomElement(LAST_NAMES);
  const maritalStatus = randomElement([
    MaritalStatus.MARRIED,
    MaritalStatus.SINGLE,
  ]);

  const dobStart = new Date('1950-01-01');
  const dobEnd = new Date('2010-12-31');

  return {
    name: `${firstName} ${lastName}`,
    phone: generateNumericPhoneNumber(),
    email: randomBoolean(0.7)
      ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@example.com`
      : null,
    gender: accountGender,
    maritalStatus,
    dob: randomDate(dobStart, dobEnd),
    claimed: randomBoolean(0.3),
    isActive: randomBoolean(0.95),
    failedLoginAttempts: randomBoolean(0.1)
      ? Math.floor(Math.random() * 5)
      : 0,
    lockUntil: randomBoolean(0.05) ? new Date(Date.now() + 3600000) : null,
  };
}

function generateChurchName(index: number): string {
  const prefix = randomElement(CHURCH_PREFIXES);
  const location = CHURCH_LOCATIONS[index % CHURCH_LOCATIONS.length];
  const suffix =
    index >= CHURCH_LOCATIONS.length
      ? ` ${Math.floor(index / CHURCH_LOCATIONS.length) + 1}`
      : '';
  return `${prefix} ${location}${suffix}`;
}

function generateActivityData(
  type: ActivityType,
  bipra: Bipra,
  index: number,
) {
  const title = randomElement(ACTIVITY_TITLES[type]);
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 90));

  return {
    title: `${title} ${index}`,
    activityType: type,
    bipra,
    date: futureDate,
    description: randomBoolean(0.6)
      ? `Deskripsi lengkap untuk ${title} ${index}`
      : null,
    note: randomBoolean(0.7) ? `Catatan untuk ${title} ${index}` : null,
    fileUrl: randomBoolean(0.3)
      ? `https://example.com/activity-${index}.pdf`
      : null,
  };
}

// ============================================================================
// MAIN SEEDING LOGIC
// ============================================================================

async function cleanDatabase() {
  console.log('🧹 Cleaning existing data...');
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
  console.log('✅ Database cleaned');
}

async function seedAccounts(passwordHash: string) {
  console.log('👤 Creating accounts...');

  const accountsData = [];

  // Create diverse accounts with all possible combinations
  for (let i = 0; i < CONFIG.churches * CONFIG.accountsPerChurch; i++) {
    const accountData = {
      ...generateAccountData(i),
      passwordHash,
    };
    
    // Ensure the first account has the specific phone number
    if (i === 0) {
      accountData.phone = '081111111111';
    }
    
    accountsData.push(accountData);
  }

  // Create accounts without membership
  for (let i = 0; i < CONFIG.extraAccountsWithoutMembership; i++) {
    accountsData.push({
      ...generateAccountData(
        CONFIG.churches * CONFIG.accountsPerChurch + i,
      ),
      passwordHash,
    });
  }

  const accounts = await Promise.all(
    accountsData.map((data) => prisma.account.create({ data: data as any })),
  );

  console.log(`✅ Created ${accounts.length} accounts`);
  return accounts;
}

async function seedChurches() {
  console.log('🏛️ Creating churches...');

  const churches = [];
  for (let i = 0; i < CONFIG.churches; i++) {
    const name = generateChurchName(i);
    const area = AREAS[i % AREAS.length];
    const columns = COLUMN_TYPES[i % COLUMN_TYPES.length];

    // Create location first
    const location = await prisma.location.create({
      data: {
        name: `Lokasi ${name}`,
        latitude: generateLatitude(),
        longitude: generateLongitude(),
      },
    });

    const church = await prisma.church.create({
      data: {
        name,
        phoneNumber: randomBoolean(0.7) ? generateNumericPhoneNumber() : null,
        email: randomBoolean(0.7)
          ? `${name.toLowerCase().replace(/\s+/g, '-')}@example.com`
          : null,
        description: randomBoolean(0.6)
          ? `Gereja ${name} yang terletak di ${area}.`
          : null,
        locationId: location.id,
        columns: {
          create: columns.map((col) => ({ name: col })),
        },
      },
      include: { columns: true },
    });

    churches.push(church);
  }

  console.log(`✅ Created ${churches.length} churches`);
  return churches;
}

async function seedMemberships(accounts: any[], churches: any[]) {
  console.log('🤝 Creating memberships...');

  const memberships = [];
  const accountsWithMembership = accounts.slice(
    0,
    CONFIG.churches * CONFIG.accountsPerChurch,
  );

  for (let i = 0; i < accountsWithMembership.length; i++) {
    const account = accountsWithMembership[i];
    const churchIndex = Math.floor(i / CONFIG.accountsPerChurch);
    const church = churches[churchIndex];
    const column = randomElement(church.columns) as any;

    const membership = await prisma.membership.create({
      data: {
        accountId: account.id,
        churchId: church.id,
        columnId: column.id,
        baptize: randomBoolean(0.8),
        sidi: randomBoolean(0.6),
      },
    });

    memberships.push(membership);
  }

  console.log(`✅ Created ${memberships.length} memberships`);
  return memberships;
}

async function seedMembershipPositions(memberships: any[]) {
  console.log('📋 Creating membership positions...');

  const positions = [];

  // Assign 1-3 positions to random memberships
  const membershipsWithPositions = memberships.slice(
    0,
    Math.floor(memberships.length * 0.3),
  );

  for (const membership of membershipsWithPositions) {
    const numPositions = Math.floor(Math.random() * 3) + 1;
    const selectedPositions = [];

    for (let i = 0; i < numPositions; i++) {
      const positionName = randomElement(POSITION_NAMES);
      if (!selectedPositions.includes(positionName)) {
        selectedPositions.push(positionName);

        const position = await prisma.membershipPosition.create({
          data: {
            membershipId: membership.id,
            churchId: membership.churchId,
            name: positionName,
          },
        });

        positions.push(position);
      }
    }
  }

  console.log(`✅ Created ${positions.length} membership positions`);
  return positions;
}

async function seedActivities(memberships: any[], churches: any[]) {
  console.log('📅 Creating activities...');

  const activities = [];
  const activityTypes = Object.values(ActivityType);
  const bipraValues = Object.values(Bipra);

  for (let i = 0; i < CONFIG.churches * CONFIG.activitiesPerChurch; i++) {
    const churchIndex = Math.floor(i / CONFIG.activitiesPerChurch);
    const church = churches[churchIndex];

    // Get memberships for this church
    const churchMemberships = memberships.filter(
      (m) => m.churchId === church.id,
    );

    if (churchMemberships.length === 0) continue;

    const supervisor = randomElement(churchMemberships) as any;
    const activityType = activityTypes[i % activityTypes.length];
    const bipra = bipraValues[i % bipraValues.length];

    const activityData = generateActivityData(activityType, bipra, i);

    // Create location first if needed
    let locationId = null;
    if (randomBoolean(0.7)) {
      const location = await prisma.location.create({
        data: {
          name: `Lokasi ${activityData.title}`,
          latitude: generateLatitude(),
          longitude: generateLongitude(),
        },
      });
      locationId = location.id;
    }

    const activity = await prisma.activity.create({
      data: {
        ...activityData,
        supervisorId: supervisor.id,
        locationId,
      },
    });

    activities.push(activity);
  }

  console.log(`✅ Created ${activities.length} activities`);
  return activities;
}

async function seedApprovers(activities: any[], memberships: any[]) {
  console.log('✔️ Creating approvers...');

  const approverStatuses = Object.values(ApprovalStatus);
  const approversData = [];

  for (const activity of activities) {
    // Get activity supervisor's church
    const supervisor = memberships.find((m) => m.id === activity.supervisorId);
    if (!supervisor) continue;

    // Get other memberships from the same church
    const churchMemberships = memberships.filter(
      (m) => m.churchId === supervisor.churchId && m.id !== supervisor.id,
    );

    if (churchMemberships.length === 0) continue;

    // Add 0-2 approvers per activity
    const numApprovers = Math.floor(
      Math.random() * (CONFIG.maxApproversPerActivity + 1),
    );

    for (let i = 0; i < numApprovers && i < churchMemberships.length; i++) {
      const approver = churchMemberships[i] as any;
      const status = randomElement(approverStatuses);

      approversData.push({
        activityId: activity.id,
        membershipId: approver.id,
        status,
      });
    }
  }

  if (approversData.length > 0) {
    await prisma.approver.createMany({
      data: approversData,
      skipDuplicates: true,
    });
  }

  console.log(`✅ Created ${approversData.length} approvers`);
  return approversData;
}

async function seedSongs() {
  console.log('🎵 Creating songs...');

  const books = Object.values(Book);
  const songs = [];

  for (const book of books) {
    const titles = SONG_TITLES[book];

    for (let i = 0; i < CONFIG.songsPerBook; i++) {
      const title = titles[i % titles.length];
      const index = books.indexOf(book) * 100 + i + 1;

      const song = await prisma.song.create({
        data: {
          title: `${title} ${i + 1}`,
          index,
          book,
          link: `https://example.com/song/${book.toLowerCase()}-${index}`,
          parts: {
            create: [
              {
                index: 1,
                name: 'Bait 1',
                content: `Lirik bait 1 untuk ${title}`,
              },
              {
                index: 2,
                name: 'Reff',
                content: `Lirik reff untuk ${title}`,
              },
              {
                index: 3,
                name: 'Bait 2',
                content: `Lirik bait 2 untuk ${title}`,
              },
            ],
          },
        },
        include: { parts: true },
      });

      songs.push(song);
    }
  }

  console.log(`✅ Created ${songs.length} songs with parts`);
  return songs;
}

async function printSummary(
  accounts: any[],
  churches: any[],
  memberships: any[],
  activities: any[],
  songs: any[],
) {
  console.log('\n📊 Seed Summary:');
  console.log('================');
  console.log(`🏛️  Churches: ${churches.length}`);
  console.log(`👤 Accounts: ${accounts.length}`);
  console.log(`🤝 Memberships: ${memberships.length}`);
  console.log(`📅 Activities: ${activities.length}`);
  console.log(`🎵 Songs: ${songs.length}`);

  // Enum coverage
  console.log('\n📋 Enum Coverage:');
  console.log('================');

  const genderCounts = await prisma.account.groupBy({
    by: ['gender'],
    _count: true,
  });
  console.log('Gender:', genderCounts);

  const maritalStatusCounts = await prisma.account.groupBy({
    by: ['maritalStatus'],
    _count: true,
  });
  console.log('Marital Status:', maritalStatusCounts);

  const bipraCounts = await prisma.activity.groupBy({
    by: ['bipra'],
    _count: true,
  });
  console.log('Bipra:', bipraCounts);

  const activityTypeCounts = await prisma.activity.groupBy({
    by: ['activityType'],
    _count: true,
  });
  console.log('Activity Type:', activityTypeCounts);

  const bookCounts = await prisma.song.groupBy({
    by: ['book'],
    _count: true,
  });
  console.log('Book:', bookCounts);

  const approverStatusCounts = await prisma.approver.groupBy({
    by: ['status'],
    _count: true,
  });
  console.log('Approval Status:', approverStatusCounts);

  // Accounts without membership
  const accountsWithoutMembership = await prisma.account.findMany({
    where: { membership: { is: null } },
  });
  console.log(
    `\n👤 Accounts without membership: ${accountsWithoutMembership.length}`,
  );

  // Top churches by member count
  const topChurches = await prisma.church.findMany({
    include: {
      _count: {
        select: { memberships: true, columns: true },
      },
    },
    orderBy: { memberships: { _count: 'desc' } },
    take: 5,
  });

  console.log('\n🏆 Top 5 Churches by Member Count:');
  topChurches.forEach((church, index) => {
    console.log(
      `   ${index + 1}. ${church.name}: ${church._count.memberships} members, ${church._count.columns} columns`,
    );
  });
}

async function main() {
  const inServerEnvironment = !['localhost', '127.0.0.1'].some((host) =>
    process.env.DATABASE_POSTGRES_URL?.includes(host),
  );
  const forceSeeding = process.env.FORCE_SEEDING === 'true';

  if (inServerEnvironment) {
    if (forceSeeding) {
      console.error(
        ' ⚠️⚠️⚠️ Force seeding! Hope you know what will happen ⚠️⚠️⚠️',
      );
    } else {
      console.error('❌ Seeding is only allowed on local environments.');
      process.exit(0);
    }
  }

  console.log('🌱 Starting comprehensive seed...\n');

  try {
    // Clean database
    await cleanDatabase();

    // Generate password hash once
    const passwordHash = await bcrypt.hash(CONFIG.defaultPassword, 12);

    // Seed all entities
    const accounts = await seedAccounts(passwordHash);
    const churches = await seedChurches();
    const memberships = await seedMemberships(accounts, churches);
    await seedMembershipPositions(memberships);
    const activities = await seedActivities(memberships, churches);
    await seedApprovers(activities, memberships);
    const songs = await seedSongs();

    // Print summary
    await printSummary(accounts, churches, memberships, activities, songs);

    console.log('\n🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
