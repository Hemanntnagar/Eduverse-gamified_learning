import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Achievement from '../models/Achievement';
import Badge from '../models/Badge';
import Quest from '../models/Quest';
import Course from '../models/Course';
import Lesson from '../models/Lesson';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eduverse');
    console.log('Connected to MongoDB');

    await Achievement.deleteMany({});
    await Badge.deleteMany({});
    await Quest.deleteMany({});
    await Lesson.deleteMany({});
    await Course.deleteMany({});

    let instructor = await User.findOne({ role: 'instructor' });
    if (!instructor) {
      instructor = await User.create({
        username: 'instructor',
        email: 'instructor@eduverse.local',
        password: 'demo123',
        role: 'instructor',
      });
    }

    const achievements = await Achievement.insertMany([
      {
        name: 'First Steps',
        description: 'Reach level 5',
        icon: '👶',
        xpReward: 50,
        category: 'learning',
        requirement: { type: 'level', value: 5 },
        rarity: 'common',
      },
      {
        name: 'Rising Star',
        description: 'Reach level 10',
        icon: '⭐',
        xpReward: 100,
        category: 'learning',
        requirement: { type: 'level', value: 10 },
        rarity: 'rare',
      },
      {
        name: 'XP Master',
        description: 'Earn 10,000 XP',
        icon: '💎',
        xpReward: 200,
        category: 'learning',
        requirement: { type: 'xp', value: 10000 },
        rarity: 'epic',
      },
      {
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        xpReward: 150,
        category: 'streak',
        requirement: { type: 'streak', value: 7 },
        rarity: 'rare',
      },
      {
        name: 'Social Butterfly',
        description: 'Add 10 friends',
        icon: '🦋',
        xpReward: 100,
        category: 'social',
        requirement: { type: 'friends', value: 10 },
        rarity: 'rare',
      },
    ]);

    const badges = await Badge.insertMany([
      {
        name: 'Quick Learner',
        description: 'Complete 5 lessons in one day',
        icon: '⚡',
        category: 'learning',
        rarity: 'common',
      },
      {
        name: 'Dedicated Student',
        description: 'Complete 50 lessons',
        icon: '📚',
        category: 'learning',
        rarity: 'epic',
      },
      {
        name: 'Team Player',
        description: 'Join a team',
        icon: '👥',
        category: 'social',
        rarity: 'common',
      },
    ]);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    await Quest.create({
      title: 'Daily Learning',
      description: 'Complete 3 lessons today',
      type: 'daily',
      requirements: { type: 'lessons_completed', target: 3 },
      rewards: { xp: 100 },
      expiresAt: tomorrow,
      isActive: true,
    });

    const courseDefinitions = [
      {
        title: 'Introduction to JavaScript',
        description: 'Learn the fundamentals of JavaScript programming, from variables to functions.',
        category: 'programming',
        difficulty: 'beginner' as const,
        xpReward: 200,
        tags: ['javascript', 'web', 'programming'],
        lessons: [
          { title: 'Variables and Data Types', content: 'Learn about let, const, and primitive types.', order: 1, xpReward: 25 },
          { title: 'Functions and Scope', content: 'Understand function declarations and closures.', order: 2, xpReward: 30 },
          { title: 'Arrays and Objects', content: 'Work with collections and object literals.', order: 3, xpReward: 35 },
        ],
      },
      {
        title: 'React Fundamentals',
        description: 'Build interactive UIs with React components, props, and state.',
        category: 'programming',
        difficulty: 'intermediate' as const,
        xpReward: 300,
        tags: ['react', 'frontend', 'javascript'],
        lessons: [
          { title: 'Components and JSX', content: 'Create your first React components.', order: 1, xpReward: 40 },
          { title: 'State and Props', content: 'Manage component data flow.', order: 2, xpReward: 45 },
          { title: 'Hooks Overview', content: 'Use useState and useEffect.', order: 3, xpReward: 50 },
        ],
      },
      {
        title: 'UI/UX Design Basics',
        description: 'Master core design principles for creating user-friendly interfaces.',
        category: 'design',
        difficulty: 'beginner' as const,
        xpReward: 150,
        tags: ['design', 'ui', 'ux'],
        lessons: [
          { title: 'Design Principles', content: 'Contrast, alignment, and visual hierarchy.', order: 1, xpReward: 20 },
          { title: 'Color Theory', content: 'Choose effective color palettes.', order: 2, xpReward: 25 },
        ],
      },
      {
        title: 'Data Science with Python',
        description: 'Explore data analysis, visualization, and basic machine learning.',
        category: 'science',
        difficulty: 'advanced' as const,
        xpReward: 400,
        tags: ['python', 'data', 'science'],
        lessons: [
          { title: 'NumPy and Pandas', content: 'Manipulate data with Python libraries.', order: 1, xpReward: 50 },
          { title: 'Data Visualization', content: 'Create charts with matplotlib.', order: 2, xpReward: 55 },
          { title: 'Intro to ML', content: 'Basic supervised learning concepts.', order: 3, xpReward: 60 },
        ],
      },
      {
        title: 'Startup Essentials',
        description: 'Learn business fundamentals for launching and growing a startup.',
        category: 'business',
        difficulty: 'intermediate' as const,
        xpReward: 250,
        tags: ['business', 'startup', 'entrepreneurship'],
        lessons: [
          { title: 'Business Models', content: 'Revenue streams and value propositions.', order: 1, xpReward: 35 },
          { title: 'Market Research', content: 'Validate your idea with real users.', order: 2, xpReward: 40 },
        ],
      },
    ];

    let courseCount = 0;
    let lessonCount = 0;

    for (const def of courseDefinitions) {
      const course = await Course.create({
        title: def.title,
        description: def.description,
        instructor: instructor._id,
        category: def.category,
        difficulty: def.difficulty,
        xpReward: def.xpReward,
        tags: def.tags,
        isPublished: true,
        enrolledStudents: [],
        lessons: [],
      });

      const lessonIds = [];
      for (const lessonDef of def.lessons) {
        const lesson = await Lesson.create({
          ...lessonDef,
          courseId: course._id,
          completedBy: [],
        });
        lessonIds.push(lesson._id);
        lessonCount++;
      }

      course.lessons = lessonIds;
      await course.save();
      courseCount++;
    }

    console.log('Seed data created successfully!');
    console.log(`Created ${achievements.length} achievements`);
    console.log(`Created ${badges.length} badges`);
    console.log(`Created ${courseCount} courses with ${lessonCount} lessons`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
