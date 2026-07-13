(function () {
  "use strict";

  const task = (type, title, detail, duration, extra) => ({
    type,
    title,
    detail,
    duration,
    ...(extra || {})
  });

  const problem = (number, title, slug, difficulty, detail, duration = 35) => task(
    "problem",
    `LeetCode ${number} · ${title}`,
    detail,
    duration,
    { problem: { number, title, slug, difficulty } }
  );

  const day = (date, summary, tasks) => ({ date, summary, tasks });

  window.COURSE_DATA = {
    startDate: "2026-07-13",
    endDate: "2026-08-31",
    blackout: {
      start: "2026-08-19",
      end: "2026-08-25",
      label: "外出缓冲带"
    },
    quotes: [
      { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
      { text: "先让指针指对地方，再谈诗和远方。", author: "运行时备注" },
      { text: "过早优化是万恶之源。", author: "Donald Knuth" },
      { text: "今天的栈可以空，今天的人别彻底摆烂。", author: "栈顶观察员" },
      { text: "小步执行，胜过宏大焦虑。", author: "今日提醒" },
      { text: "调试不是失败，是程序终于肯说实话。", author: "编译器旁白" },
      { text: "如果思路绕成了环，先检查终止条件。", author: "链表生存指南" },
      { text: "最短路不是最快写完，是每一步都能解释。", author: "Dijkstra 路边牌" },
      { text: "代码读三遍不如手算一遍。", author: "考场经验" },
      { text: "休息不会清空进度，放弃才会。", author: "暑假计划" }
    ],
    weeks: [
      {
        number: 0,
        title: "基础与调试",
        shortFocus: "指针 · 复杂度 · CLI",
        hardPoint: "重点辨析 Node* 与 Node*&、动态内存生命周期、Big-O 主导项，以及 while(cin >> value) 的正确 EOF 顺序。",
        startDate: "2026-07-13",
        endDate: "2026-07-14",
        sources: [
          "Week0_Basis/studyguide_159201_2019_Tufte.pdf",
          "Week0_Basis/debugging.pdf",
          "Week0_Basis/command_line_input.pdf"
        ],
        days: [
          day("2026-07-13", "只搭好后面所有结构都会反复用到的底座：指针、动态内存与 ADT。", [
            task("learn", "指针、引用与动态内存最小复盘", "闭卷画出 Node*、Node*&、取地址与解引用的关系；列出 new/delete、悬空指针和内存泄漏三类风险。", 40),
            task("code", "跑通一组指针与传参实验", "从 Study Guide 选值传递、引用传递、动态数组示例，预测输出后再编译；为每个地址变化写一句解释。", 30),
            problem(27, "Remove Element", "remove-element", "Easy", "用双指针原地覆盖；写清楚返回长度与数组剩余区域的语义。", 30)
          ]),
          day("2026-07-14", "把 Big-O、调试和输入处理压缩成一套以后能复用的检查流程。", [
            task("learn", "复杂度与 ADT：只记判断方法", "能区分最好/平均/最坏情况，识别 O(1)、O(log n)、O(n)、O(n log n)、O(n²)，并说明 ADT 为什么与实现分离。", 35),
            task("source", "用 [2,1,0] 追踪缺陷冒泡排序", "依据 debugging.pdf 手算每轮状态；补上 -Wall -Wextra、最小复现、变量追踪和 EOF 读取检查单。", 30),
            problem(35, "Search Insert Position", "search-insert-position", "Easy", "用二分模板完成；写出循环不变量以及为什么是 O(log n)。", 30)
          ])
        ]
      },
      {
        number: 1,
        title: "数组与单链表",
        shortFocus: "节点 · 插入 · 删除",
        hardPoint: "删除头/尾、空链表、单节点和不存在节点必须单独验证；重连后还要释放内存。",
        startDate: "2026-07-15",
        endDate: "2026-07-18",
        sources: [
          "Week1_Introduction/PDFs/1-Introduction.pdf",
          "Week1_Introduction/PDFs/Tutorial1_LinkedLists (1).pdf",
          "Assignment1/159201_A1.pdf"
        ],
        days: [
          day("2026-07-15", "从数组与链表的取舍出发，真正理解 head 是什么。", [
            task("learn", "数组、稀疏矩阵与链表的取舍", "比较随机访问、插入删除、容量和内存局部性；画出 Node、head、NULL 终止的最小链表。", 40),
            task("code", "搭一个不会丢 head 的链表骨架", "实现节点定义、析构清理和遍历打印；分别解释 Node* 与 Node*& 适用位置。", 35),
            problem(707, "Design Linked List", "design-linked-list", "Medium", "先实现 get/addAtHead/addAtTail；所有边界都从空链表开始测。", 45)
          ]),
          day("2026-07-16", "集中练习头插、尾插与遍历，避免一边移动一边弄丢入口。", [
            task("learn", "头插 O(1) 与尾插 O(n)", "推导无 tail 指针时的复杂度；说明头插为什么会反转输入顺序。", 30),
            task("code", "实现头插、尾插、查找和打印", "对空链表、单节点、多节点各跑一遍；遍历只移动 current，不移动 head。", 40),
            problem(203, "Remove Linked List Elements", "remove-linked-list-elements", "Easy", "选择 dummy head 或分支处理；记录你如何覆盖连续删除。", 35)
          ]),
          day("2026-07-17", "删除链表节点时同时处理重连与释放。", [
            task("learn", "删除节点的四个边界", "空链表、删除头、删除尾、值不存在分别画图；每幅图标出 prev/current。", 35),
            task("code", "按值与按位置删除", "实现 remove-by-value 和 remove-Nth；用内存检查清单确认 delete 位置和后续指针。", 40),
            problem(876, "Middle of the Linked List", "middle-of-the-linked-list", "Easy", "用快慢指针完成；解释偶数长度时为何返回第二个中点。", 30)
          ]),
          day("2026-07-18", "用 Assignment 1 把链表、有序遍历和双指针合在一起。", [
            task("source", "Assignment 1 · 稀疏向量合并", "读题后只画数据结构和合并流程：两个有序非零项链表如何按 index 前进，不直接照搬现有代码。", 45),
            task("code", "写稀疏向量相加核心循环", "实现相等 index 相加、较小 index 先输出、尾部扫尾；说明时间复杂度 O(m+n)。", 45),
            problem(21, "Merge Two Sorted Lists", "merge-two-sorted-lists", "Easy", "用迭代双指针做同构练习；列出与稀疏向量合并的共同骨架。", 35)
          ])
        ]
      },
      {
        number: 2,
        title: "链表进阶与栈",
        shortFocus: "反转 · Stack · RPN",
        hardPoint: "原地反转的三指针顺序、浅拷贝风险，以及 RPN 中两个操作数的弹栈顺序最容易出错。",
        startDate: "2026-07-19",
        endDate: "2026-07-22",
        sources: [
          "Week2_Stacks/PDF/2-Linked-lists.pdf",
          "Week2_Stacks/tutorial2/Tutorial2_StackandRPNs.pdf",
          "Assignment2/159201_A2.pdf"
        ],
        days: [
          day("2026-07-19", "三种反转方法只重点掌握原地三指针。", [
            task("learn", "链表反转三方案对比", "比较新建链表、交换数据、原地改指针的空间与时间；指出新建法释放旧链表的问题。", 35),
            task("code", "prev / current / next 原地反转", "每轮先保存 next，再反转 current->next；用 0、1、3 个节点分别测试。", 35),
            problem(206, "Reverse Linked List", "reverse-linked-list", "Easy", "先迭代再口述递归版本；把三指针更新顺序写进错题备注。", 35)
          ]),
          day("2026-07-20", "理解循环链表与双向链表为何需要不同的终止和重连规则。", [
            task("learn", "循环链表与双向链表", "循环链表不能用 NULL 终止；双链表删除需同时维护 next 与 previous。各画一次单节点删除。", 35),
            task("code", "实现双链表一次插入与删除", "检查 front/rear，以及四个相邻指针是否全部一致；写一个反向遍历测试。", 40),
            problem(141, "Linked List Cycle", "linked-list-cycle", "Easy", "用快慢指针判断环；解释相遇而非访问 NULL 的原因。", 30)
          ]),
          day("2026-07-21", "把 Stack 当 ADT 学，不把数组实现和链表实现混为一谈。", [
            task("learn", "Stack ADT 与两种实现", "掌握 Push/Pop/Top/isEmpty；比较数组溢出与链表分配，补上空栈保护。", 35),
            task("code", "栈复制：识别浅拷贝风险", "阅读 Copy/Compare 代码，画出 A=B 后两个对象共享头指针的状态；给出深拷贝策略。", 35),
            problem(155, "Min Stack", "min-stack", "Medium", "设计 O(1) getMin；可用双栈或节点同步保存当前最小值。", 40)
          ]),
          day("2026-07-22", "用 RPN 把栈操作、输入合法性和边界处理闭环。", [
            task("source", "Assignment 2 · RPN 合法性", "手算 3 4 + 2 *；再构造操作数过多、运算符过多、除零三类 INVALID 输入。", 40),
            task("code", "自制链表栈求 RPN", "每遇数字 Push，每遇运算符按 b op a 顺序 Pop；最终必须只剩一个结果。", 45),
            problem(150, "Evaluate Reverse Polish Notation", "evaluate-reverse-polish-notation", "Medium", "完成后专门检查减法和除法的操作数顺序。", 40)
          ])
        ]
      },
      {
        number: 3,
        title: "队列",
        shortFocus: "循环数组 · Deque · 路由",
        hardPoint: "循环数组的空/满判定、front/rear 同步清空，以及多端口逐周期 FIFO 调度是本周主线。",
        startDate: "2026-07-23",
        endDate: "2026-07-25",
        sources: [
          "Week3_Queues/PDF/3-Queues.pdf",
          "Week3_Queues/Tutorial3/3. Tutorials_Queues.pdf",
          "Assignment3/Assignment3.pdf"
        ],
        days: [
          day("2026-07-23", "先解决数组队列的 creeping problem，再谈循环回绕。", [
            task("learn", "Queue ADT 与循环数组", "掌握 Join/Leave/Front/isEmpty；用 first/last/count 区分空和满，手算一次索引回绕。", 40),
            task("code", "实现固定容量循环队列", "覆盖首次入队、满队、最后一次出队、下溢；索引统一使用模运算。", 40),
            problem(622, "Design Circular Queue", "design-circular-queue", "Medium", "保持 O(1) 入队出队；记录你选择 count 还是预留空位区分空满。", 45)
          ]),
          day("2026-07-24", "链表队列的关键是 front/rear 同步维护。", [
            task("learn", "链表队列与双端队列", "说明尾入头出为何都是 O(1)；最后一个元素出队后必须同时清空 front/rear。", 35),
            task("code", "实现 Deque 四个方向操作", "实现头尾插入和头尾删除；每一步打印两端值与空状态。", 45),
            problem(641, "Design Circular Deque", "design-circular-deque", "Medium", "优先复用昨天的循环数组不变量，再扩展两端操作。", 45)
          ]),
          day("2026-07-25", "用路由器模拟理解“每端口一个队列”的状态变化。", [
            task("source", "Assignment 3 · 256 端口路由器", "手画一个 cycle：按端口编号从每个输入队列取 1 包送到输出队列，标出未处理包留下的位置。", 45),
            task("code", "实现最小版多队列调度", "先用 4 个端口验证 FIFO 与逐周期规则；再思考扩展到 256 端口的数据结构。", 40),
            problem(933, "Number of Recent Calls", "number-of-recent-calls", "Easy", "用队列保留时间窗口；解释为什么旧请求只会从队首移除。", 30)
          ])
        ]
      },
      {
        number: 4,
        title: "模板与 STL",
        shortFocus: "Vector · 泛型 List · 深拷贝",
        hardPoint: "模板类外定义、current 状态游标、Vector size/capacity 边界与 List 深拷贝需要一起掌握。",
        startDate: "2026-07-26",
        endDate: "2026-07-28",
        sources: [
          "Week4_TemplatesandSTL/PDF/4-Lists_Vectors.pdf",
          "Week4_TemplatesandSTL/Tutorial4_Lists/Tutorial4_Lists.pdf",
          "Assignment4/159201_A4.pdf"
        ],
        days: [
          day("2026-07-26", "掌握 Vector 与模板最常用的边界，不把 STL 当魔法。", [
            task("learn", "Vector 容量、size 与模板实例化", "区分 size/capacity/resize/push_back；写出 template<class T> 类与类外成员定义的最小形式。", 40),
            task("code", "把硬编码容器改成模板", "从 booklist 或 template1.cpp 选一个例子，改成可保存 int 与自定义 Book 的通用版本。", 40),
            problem(88, "Merge Sorted Array", "merge-sorted-array", "Easy", "利用 Vector/数组索引，从尾部合并避免覆盖。", 30)
          ]),
          day("2026-07-27", "通用 List 的难点是遍历游标和深拷贝。", [
            task("learn", "List<T>、current 游标与深拷贝", "说明 FirstItem/NextItem 如何改变 current；画出只复制 front 导致的共享节点。", 35),
            task("code", "实现 MakeCopy 与双向遍历", "复制每个节点，不共享指针；为 PreviousItem 和反向打印写测试。", 45),
            problem(217, "Contains Duplicate", "contains-duplicate", "Easy", "用 vector 排序与 unordered_set 各做一次，比较复杂度与额外空间。", 30)
          ]),
          day("2026-07-28", "用任意长整数加法复习栈、字符转换和进位。", [
            task("source", "Assignment 4 · 任意长整数加法", "先手算 999 + 1，明确每位入栈、逐位弹出、carry 更新与最高位进位。", 35),
            task("code", "实现 BigNumber 加法核心", "不使用内置大整数；覆盖长度不同、连续进位和前导零输入。", 45),
            problem(445, "Add Two Numbers II", "add-two-numbers-ii", "Medium", "用栈从低位开始相加；对照 Assignment 4 的同构过程。", 45)
          ])
        ]
      },
      {
        number: 5,
        title: "二叉树",
        shortFocus: "遍历 · 高度 · BFS",
        hardPoint: "非递归后序的 lastVisited、BFS 分层，以及讲义中 complete/perfect 术语冲突需要特别标记。",
        startDate: "2026-07-29",
        endDate: "2026-08-02",
        sources: [
          "Week5_Trees/PDF/5-BinaryTrees.pdf",
          "Week5_Trees/tutorial5/Tutorial5_Trees.pdf",
          "Assignment5/159201_A5.pdf"
        ],
        days: [
          day("2026-07-29", "先统一树的术语、表示与高度定义。", [
            task("learn", "树术语与左孩子-右兄弟表示", "区分根、叶、层、深度、高度、森林；把一个一般树改画成二叉表示。", 35),
            task("code", "自底向上构造二叉树并求高度", "本课程采用空树 0、单节点 1；写出 1 + max(left,right) 递归。", 40),
            problem(104, "Maximum Depth of Binary Tree", "maximum-depth-of-binary-tree", "Easy", "递归解法完成后，口述 BFS 按层计数版本。", 30)
          ]),
          day("2026-07-30", "把前序、中序、后序与递归调用时机对应起来。", [
            task("learn", "三种递归遍历", "在同一棵树上手算 preorder/inorder/postorder；圈出访问根节点发生的位置。", 35),
            task("code", "实现递归三序遍历", "只改变 visit 的位置复用骨架；空节点立即返回。", 35),
            problem(94, "Binary Tree Inorder Traversal", "binary-tree-inorder-traversal", "Easy", "先写递归版；明天再用栈消除递归。", 30)
          ]),
          day("2026-07-31", "非递归遍历重点掌握中序压左链与后序 lastVisited。", [
            task("learn", "栈实现非递归中序与后序", "中序不断压左链；后序用 lastVisited 判断右子树是否已经处理。", 45),
            task("code", "完成非递归后序", "对只有左子树、只有右子树和完整三节点树逐步打印栈状态。", 45),
            problem(145, "Binary Tree Postorder Traversal", "binary-tree-postorder-traversal", "Easy", "禁止先反转结果的捷径，练习 lastVisited 版本。", 40)
          ]),
          day("2026-08-01", "用队列把树按层展开。", [
            task("learn", "层序遍历与 BFS 队列", "明确出队访问、左孩子入队、右孩子入队的顺序；用队列长度分层。", 35),
            task("code", "实现按层输出", "每层换行并记录层节点数；比较普通 BFS 与美化打印的职责。", 40),
            problem(102, "Binary Tree Level Order Traversal", "binary-tree-level-order-traversal", "Medium", "用当前层 size 生成二维结果；不混用下一层节点数。", 40)
          ]),
          day("2026-08-02", "解决讲义中的 full / perfect / complete 用词冲突，并完成树阶段综合。", [
            task("learn", "Full / Perfect / Complete 标准辨析", "采用本地对比图的标准定义；额外标注主讲义把 complete 与 perfect 混用的差异。", 35),
            task("source", "Assignment 5 · RPN 表达式树", "用栈从 RPN 构树：操作数入栈，运算符弹出右/左孩子；输出全括号中缀。", 45),
            problem(958, "Check Completeness of a Binary Tree", "check-completeness-of-a-binary-tree", "Medium", "BFS 遇到第一个空位后，后续不能再出现非空节点。", 40)
          ])
        ]
      },
      {
        number: 6,
        title: "BST 与 AVL",
        shortFocus: "搜索 · 删除 · 旋转",
        hardPoint: "BST 双孩子删除必须正确寻找前驱/后继；退化复杂度与 AVL 四类旋转决定搜索性能。",
        startDate: "2026-08-03",
        endDate: "2026-08-06",
        sources: [
          "Week6_BinarySearchTrees/PDF/6-Special_BinaryTrees.pdf",
          "Week6_BinarySearchTrees/tutorial6/Tutorial6_BST.pdf",
          "Week6_BinarySearchTrees/CodeExamples/BST_delete_3cases.cpp"
        ],
        days: [
          day("2026-08-03", "从 BST 有序性推导搜索路径和复杂度。", [
            task("learn", "BST 不变量与搜索", "左子树键值更小、右子树更大；分别画平衡与退化链状 BST 的搜索路径。", 35),
            task("code", "递归与迭代搜索", "比较返回 Node* 与通过引用修改指针；写出最好 O(log n)、最坏 O(n) 的条件。", 35),
            problem(700, "Search in a Binary Search Tree", "search-in-a-binary-search-tree", "Easy", "利用有序性只走一侧，不做完整 DFS。", 30)
          ]),
          day("2026-08-04", "BST 插入就是搜索失败位置的重连。", [
            task("learn", "递归与迭代插入", "追踪 parent/current；说明新节点为什么一定成为叶子。", 30),
            task("code", "实现插入并验证中序有序", "插入一组会形成平衡树和一组升序输入；打印中序与高度。", 40),
            problem(701, "Insert into a Binary Search Tree", "insert-into-a-binary-search-tree", "Medium", "完成递归版并解释返回子树根的意义。", 35)
          ]),
          day("2026-08-05", "删除是 BST 最容易在考场断链的地方。", [
            task("learn", "BST 删除三种情况", "叶子、单孩子、双孩子分别画图；双孩子用右子树最小值或左子树最大值替换。", 45),
            task("code", "实现删除与后继查找", "重点测试删除根、删除不存在键、后继正好是右孩子。", 45),
            problem(450, "Delete Node in a BST", "delete-node-in-a-bst", "Medium", "完成后用中序遍历验证仍然有序。", 45)
          ]),
          day("2026-08-06", "用上下界验证 BST，再认识 AVL 如何阻止树退化。", [
            task("learn", "BST 验证与 AVL 四类旋转", "局部比较孩子不够，BST 需传递合法区间；再识别 LL、RR、LR、RL 失衡与修复方向。", 45),
            task("source", "手算 BST 全流程与一次 AVL 修复", "从 Tutorial 6 选键序列，记录插入、搜索、删除后的中序与高度；再画一次失衡定位和旋转。", 40),
            problem(98, "Validate Binary Search Tree", "validate-binary-search-tree", "Medium", "使用 long 上下界或中序严格递增；避免 int 边界溢出。", 40)
          ])
        ]
      },
      {
        number: 7,
        title: "堆与多路结构",
        shortFocus: "Heap · Thread · B-tree",
        hardPoint: "堆边界、线索标志、B-tree 分裂向上传播和 bit vector 删除前的成员检查是四个高风险点。",
        startDate: "2026-08-07",
        endDate: "2026-08-10",
        sources: [
          "Week7_HeapsAVLTrees_ThreadedTrees_SetsandBag/PDF/7-Heaps_BTrees.pdf",
          "Week7_HeapsAVLTrees_ThreadedTrees_SetsandBag/PDF/week7.md",
          "Assignment7/159201_A7.pdf"
        ],
        days: [
          day("2026-08-07", "把 Heap 看成数组上的完全二叉树。", [
            task("learn", "堆下标、上浮与下沉", "写出 parent/left/right 下标公式；手算一次插入上浮和删除根下沉。", 40),
            task("code", "实现 min-heap insert/deleteMin", "禁止直接调用 priority_queue；每次交换都计数，为 Assignment 7 做准备。", 45),
            problem(1046, "Last Stone Weight", "last-stone-weight", "Easy", "用最大堆反复取两个最大值；说明每轮复杂度。", 35)
          ]),
          day("2026-08-08", "把优先队列与 Heap Sort 建立在同一组上浮/下沉操作上。", [
            task("learn", "优先队列与 Heap Sort", "说明 heapify、连续 deleteRoot 和结果写回方向；max-heap 最大值应从数组尾部向前填。", 40),
            task("code", "实现流式 Top-K", "维护大小为 k 的 min-heap；每次只保留目前最大的 k 个值。", 40),
            problem(703, "Kth Largest Element in a Stream", "kth-largest-element-in-a-stream", "Easy", "用大小为 k 的最小堆，堆顶始终是当前第 k 大。", 40)
          ]),
          day("2026-08-09", "Threaded Tree 与 B-tree 以手算和结构辨识为主。", [
            task("learn", "线索二叉树与 B-tree", "区分真实孩子指针和 lthread/rthread；理解多路平衡搜索树的节点容量、分裂和向上提升。", 45),
            task("source", "无栈中序 + order-3 B-tree 插入", "画中序前驱/后继线索；再从空树连续插键，标出每次分裂与中间键提升。", 40),
            problem(215, "Kth Largest Element in an Array", "kth-largest-element-in-an-array", "Medium", "用大小为 k 的最小堆；写清 O(n log k) 与空间 O(k)。", 40)
          ]),
          day("2026-08-10", "用 Set/Bag 和 Assignment 7 收束本周。", [
            task("learn", "Set、Bag 与 bit vector", "比较链表、数组、BST、位图实现；删除位之前先确认成员存在，避免 XOR 误翻转。", 35),
            task("source", "Assignment 7 · Heap swap 实验", "比较 original/ascending/descending 输入在插入与删除阶段的 swap 次数，先写假设再运行。", 45),
            problem(349, "Intersection of Two Arrays", "intersection-of-two-arrays", "Easy", "用集合去重并求交；再解释 bit vector 适用的键范围条件。", 35)
          ])
        ]
      },
      {
        number: 8,
        title: "图",
        shortFocus: "表示 · 遍历 · 最短路",
        hardPoint: "visited 时机、无向边双向记录、Kruskal 环检测与 Dijkstra 非负权限制必须说得清。",
        startDate: "2026-08-11",
        endDate: "2026-08-15",
        sources: [
          "Week8_Graphs/PDF/8-Graphs.pdf",
          "Week8_Graphs/tutorial7/Tutorial7_Graphs_Dijkstra.pdf",
          "Assignment6/Assignment6_2023.pdf"
        ],
        days: [
          day("2026-08-11", "先能在邻接矩阵与邻接表之间正确选择。", [
            task("learn", "图术语与两种表示", "区分有向/无向、带权/无权、路径、环、连通；比较矩阵 O(V²) 与邻接表 O(V+E) 空间。", 40),
            task("code", "把一张图写成两种表示", "从本地 graph.png 或教程图取样，核对无向边是否写了两个方向。", 35),
            problem(1971, "Find if Path Exists in Graph", "find-if-path-exists-in-graph", "Easy", "建邻接表后用 BFS 或 DFS；记录 visited 设置时机。", 35)
          ]),
          day("2026-08-12", "遍历图时，visited 是防止绕圈的边界。", [
            task("learn", "BFS、DFS 与连通分量", "手算同一图的 BFS/DFS 顺序；说明 visited 入队时标记和出队时标记的差异。", 35),
            task("code", "实现邻接表 BFS 与 DFS", "覆盖不连通图：从每个未访问顶点重新启动遍历并计数分量。", 45),
            problem(200, "Number of Islands", "number-of-islands", "Medium", "把二维网格视作图；每发现一个未访问陆地就启动一次遍历。", 40)
          ]),
          day("2026-08-13", "通过一次填色题巩固图搜索的边界与方向。", [
            task("learn", "网格图与搜索边界", "整理四方向数组、越界判断、原颜色与目标颜色相同的提前返回。", 30),
            task("code", "写 DFS 与 BFS 两版 flood fill", "比较递归深度与显式队列；为每个节点只染色一次。", 35),
            problem(733, "Flood Fill", "flood-fill", "Easy", "先判断新旧颜色相同，避免无限重复。", 30)
          ]),
          day("2026-08-14", "Dijkstra 要理解‘确定最短距离’而不是背模板。", [
            task("learn", "Dijkstra 松弛与优先队列", "手算 dist 数组变化；说明为什么负权边不适用，以及 stale heap entry 如何跳过。", 45),
            task("code", "邻接表 + min-heap Dijkstra", "目标复杂度 O((V+E) log V)；不可达保持 inf。", 50),
            problem(743, "Network Delay Time", "network-delay-time", "Medium", "完成标准 Dijkstra；最终取最大最短距离，存在 inf 则返回 -1。", 45)
          ]),
          day("2026-08-15", "用 MST 与 Assignment 6 收束图阶段。", [
            task("learn", "Kruskal / Prim 与最短路区别", "MST 最小化整棵生成树权重；最短路最小化从源点到各点距离。手算一次 Kruskal。", 40),
            task("source", "Assignment 6 · 复杂度与不可达验证", "解释为何要求 adjacency list + heap；设计连通、断开、重复边三组测试。", 40),
            problem(1584, "Min Cost to Connect All Points", "min-cost-to-connect-all-points", "Medium", "用 Prim 或 Kruskal；明确它求的是 MST，不是 Dijkstra。", 50)
          ])
        ]
      },
      {
        number: 9,
        title: "基础排序",
        shortFocus: "冒泡 · 选择 · 插入",
        hardPoint: "不要混淆精确比较次数与渐进复杂度；初始顺序只会改善部分算法。",
        startDate: "2026-08-16",
        endDate: "2026-08-18",
        sources: [
          "Week9_SortingAlgorithms(part 1)/PDF/9-Sorting_part1.pdf",
          "Week9_SortingAlgorithms(part 1)/tutorial8/Tutorial8_Sorting.pdf",
          "Week9_SortingAlgorithms(part 1)/CodeExamples/week9_InsertionSort.cpp"
        ],
        days: [
          day("2026-08-16", "先掌握排序比较维度，再手算代码。", [
            task("learn", "排序评价：时间、空间、稳定性", "比较冒泡、选择、插入的最好/平均/最坏复杂度，标注原地与稳定性。", 40),
            task("source", "逐轮追踪冒泡排序", "用 [5,1,4,2,8] 写出每轮数组；加入提前终止标记并解释最好 O(n)。", 35),
            problem(283, "Move Zeroes", "move-zeroes", "Easy", "练习稳定的原地移动；保留非零元素相对顺序。", 30)
          ]),
          day("2026-08-17", "用颜色分类理解局部有序区如何扩张。", [
            task("learn", "选择排序与插入排序", "选择排序每轮固定一个最小值；插入排序维护前缀有序。比较有序输入时的表现。", 35),
            task("code", "实现并统计比较/交换次数", "对随机、升序、降序三组输入运行三种基础排序。", 45),
            problem(75, "Sort Colors", "sort-colors", "Medium", "用 Dutch National Flag 一趟完成；明确 low/current/high 不变量。", 40)
          ]),
          day("2026-08-18", "外出前做一次可中断的链表排序综合。", [
            task("learn", "链表上的插入排序", "数组插入需要移动元素，链表插入需要重连节点；比较二者代价。", 30),
            task("code", "实现链表 insertion sort", "使用 dummy 维护已排序区；每次保存 current->next 再插入。", 40),
            problem(147, "Insertion Sort List", "insertion-sort-list", "Medium", "完成后画出一次中间插入的四个指针变化。", 45)
          ])
        ]
      },
      {
        number: 10,
        title: "高级排序",
        shortFocus: "Quick · Merge · Heap/Radix",
        hardPoint: "Quick partition 边界、Merge 剩余段复制、Radix 收集顺序与 Heap Sort 写回方向最易错。",
        startDate: "2026-08-26",
        endDate: "2026-08-28",
        sources: [
          "Week10_SortingAlgorithms(part 2)/PDF/10-Sorting_part2.pdf",
          "Week10_SortingAlgorithms(part 2)/PDF/10-Merge sort lecture note - Yi Wang.pdf",
          "Week10_SortingAlgorithms(part 2)/tutorial9/Tutorial9_Sorting2_Hashing.pdf"
        ],
        days: [
          day("2026-08-26", "复学第一天只抓 Quick Sort 的 partition。", [
            task("learn", "Quicksort 分区与退化", "手算一次 Lomuto 或 Hoare partition；解释枢轴选择与 O(n²) 退化。", 40),
            task("code", "实现 quicksort 并打印分区边界", "测试重复值、已排序、逆序输入；只保留最终干净版本。", 45),
            problem(912, "Sort an Array", "sort-an-array", "Medium", "用 quicksort 完成后，用同一测试集验证；避免依赖库 sort。", 50)
          ]),
          day("2026-08-27", "Merge Sort 的核心是稳定合并和辅助空间。", [
            task("learn", "归并排序递归树", "画分解与合并层；说明 O(n log n)、稳定性与 O(n) 辅助空间。", 35),
            task("code", "实现数组 merge 与链表 merge sort", "数组用临时缓冲；链表用快慢指针切半并复用有序链表合并。", 50),
            problem(148, "Sort List", "sort-list", "Medium", "目标 O(n log n)；用 merge sort，避免插入排序 O(n²)。", 50)
          ]),
          day("2026-08-28", "用非比较排序和堆排序完成排序全景图。", [
            task("learn", "Heap Sort 与 Radix Sort", "比较比较排序下界、堆排序原地性、基数排序对位数/基数的依赖。", 40),
            task("source", "排序选择表与手算一轮 radix", "为几乎有序、内存受限、稳定性优先、整数定长四种场景选算法并解释。", 35),
            problem(164, "Maximum Gap", "maximum-gap", "Medium", "优先思考桶/基数思路，理解线性复杂度建立在整数范围结构上。", 45)
          ])
        ]
      },
      {
        number: 11,
        title: "搜索与哈希",
        shortFocus: "Binary · Collision · Cichelli",
        hardPoint: "负载因子和探测序列决定哈希性能；探测步长必须与表长互质，Cichelli 需要回溯搜索 g 值。",
        startDate: "2026-08-29",
        endDate: "2026-08-31",
        sources: [
          "Week11_SearchingAndHashing/PDF/11-Hashing.pdf",
          "Week11_SearchingAndHashing/tutorial10/Tutorial10_Cicheli_TSP.pdf",
          "考前30题单选自测.md"
        ],
        days: [
          day("2026-08-29", "把顺序搜索、二分搜索和排序前提连起来。", [
            task("learn", "搜索复杂度与二分不变量", "比较线性 O(n) 和二分 O(log n)；写出左闭右闭或左闭右开的一套一致模板。", 35),
            task("code", "实现 iterative binary search", "覆盖空数组、单元素、找不到、首尾命中；避免 mid 溢出。", 35),
            problem(704, "Binary Search", "binary-search", "Easy", "不背代码，逐轮写出 left/right/mid 和被排除区间。", 30)
          ]),
          day("2026-08-30", "哈希重点是冲突处理和负载因子，不只会写取模。", [
            task("learn", "哈希函数、冲突与负载因子", "比较 chaining、linear probing、quadratic probing；手算插入与查找失败路径。", 45),
            task("code", "实现最小 HashSet", "自选链地址或开放寻址；覆盖重复插入、删除后再查找和扩容策略。", 45),
            problem(705, "Design HashSet", "design-hashset", "Easy", "不调用内置哈希集合；把冲突处理写成可解释的实现。", 40)
          ]),
          day("2026-08-31", "最后一天做溯源复盘：哈希、Cichelli 与全课程最小闭环。", [
            task("learn", "Cichelli perfect hashing 与课程收束", "理解首尾字符权重与无冲突搜索；知道 TSP/Knapsack 是课程拓展，不在暑假强行展开。", 40),
            task("source", "30 题自测 + 错因归类", "限时完成考前30题单选自测；只记录错因：概念混淆、手算失误、代码阅读或复杂度。", 45),
            problem(49, "Group Anagrams", "group-anagrams", "Medium", "选择排序字符串或字符频次作哈希键；比较键构造成本。", 45)
          ])
        ]
      }
    ]
  };
})();
