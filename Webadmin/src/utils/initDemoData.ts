import dayjs from 'dayjs'

// Initialize all demo data for testing
export const initAllDemoData = () => {
  // 0. Users (15 users) - MUST BE FIRST
  const storedUsers = localStorage.getItem('all_users')
  if (!storedUsers || JSON.parse(storedUsers || '[]').length !== 15) {
    const demoUsers = [
      {
        id: '1',
        fullName: 'Nguyễn Văn Admin',
        email: 'admin@fepa.com',
        phone: '0901234567',
        role: 'admin',
        status: 'active',
        createdAt: dayjs().subtract(180, 'day').format('YYYY-MM-DD HH:mm:ss'),
        lastLogin: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: '2',
        fullName: 'Trần Thị B',
        email: 'tranthib@gmail.com',
        phone: '0912345678',
        role: 'admin',
        status: 'active',
        createdAt: dayjs().subtract(150, 'day').format('YYYY-MM-DD HH:mm:ss'),
        lastLogin: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: '3',
        fullName: 'Lê Văn C',
        email: 'levanc@outlook.com',
        phone: '0923456789',
        role: 'user',
        status: 'active',
        createdAt: dayjs().subtract(120, 'day').format('YYYY-MM-DD HH:mm:ss'),
        lastLogin: dayjs().subtract(5, 'hour').format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: '4',
        fullName: 'Phạm Thị D',
        email: 'phamthid@yahoo.com',
        phone: '0934567890',
        role: 'user',
        status: 'active',
        createdAt: dayjs().subtract(100, 'day').format('YYYY-MM-DD HH:mm:ss'),
        lastLogin: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: '5',
        fullName: 'Hoàng Văn E',
        email: 'hoangvane@fepa.com',
        phone: '0945678901',
        role: 'user',
        status: 'locked',
        createdAt: dayjs().subtract(90, 'day').format('YYYY-MM-DD HH:mm:ss'),
        lastLogin: dayjs().subtract(30, 'day').format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: '6',
        fullName: 'Vũ Thị F',
        email: 'vuthif@gmail.com',
        phone: '0956789012',
        role: 'user',
        status: 'active',
        createdAt: dayjs().subtract(80, 'day').format('YYYY-MM-DD HH:mm:ss'),
        lastLogin: dayjs().subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: '7',
        fullName: 'Đặng Văn G',
        email: 'dangvang@outlook.com',
        phone: '0967890123',
        role: 'user',
        status: 'active',
        createdAt: dayjs().subtract(70, 'day').format('YYYY-MM-DD HH:mm:ss'),
        lastLogin: dayjs().subtract(12, 'hour').format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: '8',
        fullName: 'Bùi Thị H',
        email: 'buithih@yahoo.com',
        phone: '0978901234',
        role: 'user',
        status: 'locked',
        createdAt: dayjs().subtract(60, 'day').format('YYYY-MM-DD HH:mm:ss'),
        lastLogin: dayjs().subtract(45, 'day').format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: '9',
        fullName: 'Ngô Văn I',
        email: 'ngovani@fepa.com',
        phone: '0989012345',
        role: 'user',
        status: 'active',
        createdAt: dayjs().subtract(50, 'day').format('YYYY-MM-DD HH:mm:ss'),
        lastLogin: dayjs().subtract(6, 'hour').format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: '10',
        fullName: 'Hà Thị M',
        email: 'hathim@gmail.com',
        phone: '0990123456',
        role: 'user',
        status: 'active',
        createdAt: dayjs().subtract(40, 'day').format('YYYY-MM-DD HH:mm:ss'),
        lastLogin: dayjs().subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: '11',
        fullName: 'Lý Văn K',
        email: 'lyvank@outlook.com',
        phone: '0901234560',
        role: 'user',
        status: 'active',
        createdAt: dayjs().subtract(35, 'day').format('YYYY-MM-DD HH:mm:ss'),
        lastLogin: dayjs().subtract(2, 'hour').format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: '12',
        fullName: 'Mai Thị L',
        email: 'maithil@yahoo.com',
        phone: '0912345601',
        role: 'user',
        status: 'locked',
        createdAt: dayjs().subtract(30, 'day').format('YYYY-MM-DD HH:mm:ss'),
        lastLogin: dayjs().subtract(20, 'day').format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: '13',
        fullName: 'Đỗ Văn N',
        email: 'dovann@fepa.com',
        phone: '0923456702',
        role: 'user',
        status: 'active',
        createdAt: dayjs().subtract(25, 'day').format('YYYY-MM-DD HH:mm:ss'),
        lastLogin: dayjs().subtract(4, 'hour').format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: '14',
        fullName: 'Tô Thị O',
        email: 'tothio@gmail.com',
        phone: '0934567803',
        role: 'user',
        status: 'active',
        createdAt: dayjs().subtract(20, 'day').format('YYYY-MM-DD HH:mm:ss'),
        lastLogin: dayjs().subtract(10, 'hour').format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: '15',
        fullName: 'Phan Văn P',
        email: 'phanvanp@outlook.com',
        phone: '0945678904',
        role: 'user',
        status: 'active',
        createdAt: dayjs().subtract(15, 'day').format('YYYY-MM-DD HH:mm:ss'),
        lastLogin: dayjs().subtract(7, 'hour').format('YYYY-MM-DD HH:mm:ss')
      }
    ]
    localStorage.setItem('all_users', JSON.stringify(demoUsers))
  }

  // 1. Categories (8 categories)
  if (!localStorage.getItem('categories') || JSON.parse(localStorage.getItem('categories') || '[]').length < 8) {
    const categories = [
      { id: '1', name: 'Ăn uống', description: 'Chi phí ăn uống', color: '#ff6b6b', icon: '🍔', usageCount: 45 },
      { id: '2', name: 'Di chuyển', description: 'Xe bus, taxi, xăng', color: '#4ecdc4', icon: '🚗', usageCount: 32 },
      { id: '3', name: 'Mua sắm', description: 'Quần áo, đồ dùng', color: '#ffd93d', icon: '🛍️', usageCount: 28 },
      { id: '4', name: 'Giải trí', description: 'Phim, game, du lịch', color: '#a29bfe', icon: '🎮', usageCount: 22 },
      { id: '5', name: 'Nhà cửa', description: 'Tiền nhà, điện nước', color: '#fd79a8', icon: '🏠', usageCount: 18 },
      { id: '6', name: 'Sức khỏe', description: 'Thuốc, bệnh viện', color: '#00b894', icon: '💊', usageCount: 15 },
      { id: '7', name: 'Giáo dục', description: 'Học phí, sách vở', color: '#0984e3', icon: '📚', usageCount: 12 },
      { id: '8', name: 'Khác', description: 'Chi phí khác', color: '#b2bec3', icon: '📦', usageCount: 8 }
    ]
    localStorage.setItem('categories', JSON.stringify(categories))
  }

  // 2. Expenses (50 expenses) - Evenly distributed across users
  if (!localStorage.getItem('expenses') || JSON.parse(localStorage.getItem('expenses') || '[]').length < 50) {
    const users = JSON.parse(localStorage.getItem('all_users') || '[]')
    const categories = JSON.parse(localStorage.getItem('categories') || '[]')
    
    const expenses = []
    // Create 3-4 expenses per user to ensure even distribution
    let expenseId = 1
    users.forEach((user: any, userIndex: number) => {
      const expenseCount = userIndex < 5 ? 4 : 3 // First 5 users get 4 expenses, rest get 3
      
      for (let i = 0; i < expenseCount; i++) {
        const categoryId = categories[Math.floor(Math.random() * categories.length)]?.id || '1'
        const amount = Math.floor(Math.random() * 500000) + 10000
        const daysAgo = Math.floor(Math.random() * 90)
        
        expenses.push({
          id: expenseId.toString(),
          userId: user.id,
          categoryId,
          amount,
          description: `Chi tiêu của ${user.fullName} - Lần ${i + 1}`,
          date: dayjs().subtract(daysAgo, 'day').toISOString(),
          createdAt: dayjs().subtract(daysAgo, 'day').toISOString()
        })
        expenseId++
      }
    })
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }

  // 3. Budgets (ensure all users have at least 2-3 budgets) - CALCULATED FROM EXPENSES
  if (!localStorage.getItem('budgets') || JSON.parse(localStorage.getItem('budgets') || '[]').length < 25) {
    const users = JSON.parse(localStorage.getItem('all_users') || '[]')
    const categories = JSON.parse(localStorage.getItem('categories') || '[]')
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]')
    
    const budgets = []
    let budgetId = 1
    
    // Create 2-3 budgets for each user with spent calculated from actual expenses
    users.forEach((user: any, userIndex: number) => {
      const budgetCount = Math.floor(Math.random() * 2) + 2 // 2-3 budgets per user
      
      // Get random categories for this user's budgets
      const userCategories = [...categories].sort(() => Math.random() - 0.5).slice(0, budgetCount)
      
      userCategories.forEach((category: any) => {
        // Calculate actual spent from expenses for this user + category
        const userCategoryExpenses = expenses.filter(
          (exp: any) => exp.userId === user.id && exp.categoryId === category.id
        )
        const actualSpent = userCategoryExpenses.reduce((sum: number, exp: any) => sum + exp.amount, 0)
        
        // Set limit higher than spent (120-200% of spent, or minimum 1M if no expenses)
        const limit = actualSpent > 0 
          ? Math.max(actualSpent * (1.2 + Math.random() * 0.8), 1000000)
          : Math.floor(Math.random() * 5000000) + 1000000
        
        budgets.push({
          id: budgetId.toString(),
          userId: user.id,
          categoryId: category.id,
          limit: Math.floor(limit),
          spent: actualSpent, // Use actual spent from expenses
          month: dayjs().format('YYYY-MM'),
          createdAt: dayjs().subtract(Math.floor(Math.random() * 30), 'day').toISOString()
        })
        budgetId++
      })
    })
    
    localStorage.setItem('budgets', JSON.stringify(budgets))
  }

  // 4. Subscription Plans (3 plans)
  if (!localStorage.getItem('subscription_plans') || JSON.parse(localStorage.getItem('subscription_plans') || '[]').length < 3) {
    const plans = [
      {
        id: '1',
        name: 'Free',
        price: 0,
        duration: 'monthly',
        features: ['Tạo tối đa 10 chi tiêu/tháng', 'Xem báo cáo cơ bản', '1 ngân sách'],
        limits: { maxExpenses: 10, maxCategories: 5, maxOCRScans: 0 },
        createdAt: dayjs().subtract(6, 'month').toISOString()
      },
      {
        id: '2',
        name: 'Basic',
        price: 49000,
        duration: 'monthly',
        features: ['Tạo không giới hạn chi tiêu', 'Xem báo cáo nâng cao', '5 ngân sách', 'OCR 50 lần/tháng'],
        limits: { maxExpenses: -1, maxCategories: 20, maxOCRScans: 50 },
        createdAt: dayjs().subtract(6, 'month').toISOString()
      },
      {
        id: '3',
        name: 'Premium',
        price: 99000,
        duration: 'monthly',
        features: ['Tất cả tính năng Basic', 'AI phân tích chi tiêu', 'OCR không giới hạn', 'Export Excel/PDF', 'Hỗ trợ ưu tiên'],
        limits: { maxExpenses: -1, maxCategories: -1, maxOCRScans: -1 },
        createdAt: dayjs().subtract(6, 'month').toISOString()
      }
    ]
    localStorage.setItem('subscription_plans', JSON.stringify(plans))
  }

  // 5. User Subscriptions (10 subscriptions)
  if (!localStorage.getItem('user_subscriptions') || JSON.parse(localStorage.getItem('user_subscriptions') || '[]').length < 10) {
    const users = JSON.parse(localStorage.getItem('all_users') || '[]')
    const plans = JSON.parse(localStorage.getItem('subscription_plans') || '[]')
    
    const subscriptions = []
    for (let i = 1; i <= 10; i++) {
      const user = users[Math.floor(Math.random() * users.length)]
      const plan = plans[Math.floor(Math.random() * plans.length)]
      const startDate = dayjs().subtract(Math.floor(Math.random() * 60), 'day')
      
      subscriptions.push({
        id: i.toString(),
        userId: user?.id || '1',
        userName: user?.fullName || 'User',
        userEmail: user?.email || 'user@example.com',
        planId: plan?.id || '1',
        planName: plan?.name || 'Free',
        amount: plan?.price || 0,
        startDate: startDate.toISOString(),
        endDate: startDate.add(30, 'day').toISOString(),
        status: Math.random() > 0.2 ? 'active' : 'expired',
        autoRenew: Math.random() > 0.3,
        createdAt: startDate.toISOString()
      })
    }
    localStorage.setItem('user_subscriptions', JSON.stringify(subscriptions))
  }

  // 6. Blog Posts (8 posts)
  if (!localStorage.getItem('blog_posts') || JSON.parse(localStorage.getItem('blog_posts') || '[]').length < 8) {
    const posts = [
      {
        id: '1',
        title: '10 Mẹo Tiết Kiệm Chi Tiêu Hiệu Quả',
        slug: '10-meo-tiet-kiem-chi-tieu-hieu-qua',
        excerpt: 'Khám phá những phương pháp đơn giản nhưng hiệu quả để quản lý tài chính cá nhân',
        content: 'Nội dung chi tiết về các mẹo tiết kiệm...',
        author: 'Admin FEPA',
        category: 'Tài chính cá nhân',
        tags: ['tiết kiệm', 'quản lý chi tiêu', 'tài chính'],
        featuredImage: 'https://picsum.photos/800/400?random=1',
        status: 'published',
        views: 1250,
        createdAt: dayjs().subtract(30, 'day').toISOString(),
        updatedAt: dayjs().subtract(25, 'day').toISOString()
      },
      {
        id: '2',
        title: 'Cách Lập Ngân Sách Gia Đình Thông Minh',
        slug: 'cach-lap-ngan-sach-gia-dinh-thong-minh',
        excerpt: 'Hướng dẫn chi tiết cách phân bổ thu nhập hợp lý cho các mục tiêu tài chính',
        content: 'Nội dung về lập ngân sách...',
        author: 'Admin FEPA',
        category: 'Ngân sách',
        tags: ['ngân sách', 'gia đình', 'kế hoạch tài chính'],
        featuredImage: 'https://picsum.photos/800/400?random=2',
        status: 'published',
        views: 980,
        createdAt: dayjs().subtract(25, 'day').toISOString(),
        updatedAt: dayjs().subtract(20, 'day').toISOString()
      },
      {
        id: '3',
        title: 'Đầu Tư Cho Người Mới Bắt Đầu',
        slug: 'dau-tu-cho-nguoi-moi-bat-dau',
        excerpt: 'Những kiến thức cơ bản về đầu tư tài chính dành cho người mới',
        content: 'Nội dung về đầu tư...',
        author: 'Admin FEPA',
        category: 'Đầu tư',
        tags: ['đầu tư', 'tài chính', 'khởi nghiệp'],
        featuredImage: 'https://picsum.photos/800/400?random=3',
        status: 'published',
        views: 1500,
        createdAt: dayjs().subtract(20, 'day').toISOString(),
        updatedAt: dayjs().subtract(15, 'day').toISOString()
      },
      {
        id: '4',
        title: 'Sử Dụng FEPA: Hướng Dẫn Chi Tiết',
        slug: 'su-dung-fepa-huong-dan-chi-tiet',
        excerpt: 'Hướng dẫn toàn diện các tính năng của ứng dụng FEPA',
        content: 'Nội dung hướng dẫn...',
        author: 'Admin FEPA',
        category: 'Hướng dẫn',
        tags: ['FEPA', 'tutorial', 'app guide'],
        featuredImage: 'https://picsum.photos/800/400?random=4',
        status: 'published',
        views: 2100,
        createdAt: dayjs().subtract(15, 'day').toISOString(),
        updatedAt: dayjs().subtract(10, 'day').toISOString()
      },
      {
        id: '5',
        title: 'Quản Lý Nợ Thông Minh',
        slug: 'quan-ly-no-thong-minh',
        excerpt: 'Chiến lược hiệu quả để trả nợ và cải thiện tình hình tài chính',
        content: 'Nội dung về quản lý nợ...',
        author: 'Admin FEPA',
        category: 'Tài chính',
        tags: ['nợ', 'quản lý tài chính', 'chiến lược'],
        featuredImage: 'https://picsum.photos/800/400?random=5',
        status: 'draft',
        views: 0,
        createdAt: dayjs().subtract(10, 'day').toISOString(),
        updatedAt: dayjs().subtract(5, 'day').toISOString()
      }
    ]
    localStorage.setItem('blog_posts', JSON.stringify(posts))
  }

  // 7. Advertisements (5 ads)
  if (!localStorage.getItem('advertisements') || JSON.parse(localStorage.getItem('advertisements') || '[]').length < 5) {
    const ads = [
      {
        id: '1',
        title: 'Banner Ngân hàng ABC',
        partner: 'Ngân hàng ABC',
        bannerUrl: 'https://via.placeholder.com/800x200/4CAF50/FFFFFF?text=Ngan+hang+ABC',
        targetUrl: 'https://abc-bank.com',
        position: 'home',
        type: 'banner',
        startDate: dayjs().subtract(30, 'day').toISOString(),
        endDate: dayjs().add(30, 'day').toISOString(),
        impressions: 45000,
        clicks: 1250,
        budget: 10000000,
        spent: 6500000,
        status: 'active',
        createdAt: dayjs().subtract(30, 'day').toISOString()
      },
      {
        id: '2',
        title: 'Popup Bảo hiểm XYZ',
        partner: 'Bảo hiểm XYZ',
        bannerUrl: 'https://via.placeholder.com/600x400/2196F3/FFFFFF?text=Bao+hiem+XYZ',
        targetUrl: 'https://xyz-insurance.com',
        position: 'blog',
        type: 'popup',
        startDate: dayjs().subtract(20, 'day').toISOString(),
        endDate: dayjs().add(40, 'day').toISOString(),
        impressions: 32000,
        clicks: 890,
        budget: 8000000,
        spent: 4200000,
        status: 'active',
        createdAt: dayjs().subtract(20, 'day').toISOString()
      },
      {
        id: '3',
        title: 'Native Ad - Đầu tư Chứng khoán',
        partner: 'Công ty Chứng khoán DEF',
        bannerUrl: 'https://via.placeholder.com/400x300/FF9800/FFFFFF?text=Chung+khoan+DEF',
        targetUrl: 'https://def-securities.com',
        position: 'reports',
        type: 'native',
        startDate: dayjs().subtract(15, 'day').toISOString(),
        endDate: dayjs().add(15, 'day').toISOString(),
        impressions: 18000,
        clicks: 520,
        budget: 5000000,
        spent: 2800000,
        status: 'paused',
        createdAt: dayjs().subtract(15, 'day').toISOString()
      }
    ]
    localStorage.setItem('advertisements', JSON.stringify(ads))
  }

  console.log('✅ Demo data initialized successfully!')
}
