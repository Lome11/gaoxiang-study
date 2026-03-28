/**
 * 软考高项备考填空题题库
 * 题目分布：80% 来自 10大管理，20% 来自项目管理基础/绩效域/立项管理等
 *
 * 每道题结构：
 *   id       - 唯一编号
 *   category - 所属领域（对应 chapterKey）
 *   question - 题干（用 ___ 表示填空位）
 *   answer   - 标准答案（字符串）
 *   analysis - 解析说明
 *   keywords - 关键词（用于模糊匹配评分）
 */

export const FILL_BLANK_QUESTIONS = [
  // ============================================================
  // 【整合管理】 ~18题
  // ============================================================
  {
    id: 'int-001',
    category: 'integration',
    question: '项目整合管理包括识别、定义、组合、统一和协调各项目管理过程组中的各个过程和活动，其核心文件是___。',
    answer: '项目章程和项目管理计划',
    analysis: '项目章程正式授权项目，项目管理计划整合所有子计划，是整合管理的两个核心文件。',
    keywords: ['项目章程', '项目管理计划'],
  },
  {
    id: 'int-002',
    category: 'integration',
    question: '制定项目章程的主要输出是___，它正式授权项目经理在项目活动中使用组织资源。',
    answer: '项目章程',
    analysis: '项目章程是由发起人或执行组织高级管理层批准，正式授权项目存在的文件。',
    keywords: ['项目章程'],
  },
  {
    id: 'int-003',
    category: 'integration',
    question: '项目管理计划的制定需要整合所有子计划，其中与范围基准、进度基准、成本基准合称为___。',
    answer: '绩效测量基准',
    analysis: '绩效测量基准（PMB）= 范围基准 + 进度基准 + 成本基准，用于衡量项目执行绩效。',
    keywords: ['绩效测量基准', 'PMB'],
  },
  {
    id: 'int-004',
    category: 'integration',
    question: '指导与管理项目工作过程的主要输出包括可交付成果、工作绩效数据和___。',
    answer: '变更请求',
    analysis: '执行过程中会产生可交付成果、工作绩效数据，以及因执行中发现问题而提出的变更请求。',
    keywords: ['变更请求'],
  },
  {
    id: 'int-005',
    category: 'integration',
    question: '实施整体变更控制过程对变更请求进行审查，批准的变更请求将由___过程负责实施。',
    answer: '指导与管理项目工作',
    analysis: '实施整体变更控制审批变更，指导与管理项目工作负责执行批准的变更请求。',
    keywords: ['指导与管理项目工作'],
  },
  {
    id: 'int-006',
    category: 'integration',
    question: '监控项目工作过程将工作绩效数据转化为___，再通过实施整体变更控制提交变更请求。',
    answer: '工作绩效报告',
    analysis: '工作绩效数据 → 工作绩效信息 → 工作绩效报告，是监控活动的信息流转链条。',
    keywords: ['工作绩效报告'],
  },
  {
    id: 'int-007',
    category: 'integration',
    question: '项目收尾时，项目经理需要完成___，将项目文件、合同文件等归档，并正式结束项目。',
    answer: '结束项目或阶段',
    analysis: '结束项目或阶段过程包括：获得验收、移交成果、发布最终报告、释放资源、归档文件。',
    keywords: ['结束项目', '阶段收尾'],
  },
  {
    id: 'int-008',
    category: 'integration',
    question: '变更控制委员会（CCB）是专门负责___的正式委员会，项目经理通常是成员之一。',
    answer: '审查和批准变更请求',
    analysis: 'CCB（Change Control Board）对变更请求进行评审，有批准、拒绝或推迟处理的权力。',
    keywords: ['CCB', '变更控制委员会', '审查', '批准'],
  },
  {
    id: 'int-009',
    category: 'integration',
    question: '配置管理系统是整合变更控制系统的子系统，主要用于管理项目___的变更。',
    answer: '文件和可交付成果（技术配置项）',
    analysis: '配置管理系统跟踪和控制配置项（文件、代码、交付物等）的版本和变更历史。',
    keywords: ['配置管理', '配置项'],
  },
  {
    id: 'int-010',
    category: 'integration',
    question: '项目章程中应记录高层级的项目描述、可测量目标、总体里程碑进度计划和___。',
    answer: '项目经理的姓名和职权',
    analysis: '项目章程授权项目经理，因此必须明确项目经理姓名及其在项目中的职权范围。',
    keywords: ['项目经理', '职权'],
  },
  {
    id: 'int-011',
    category: 'integration',
    question: '项目管理信息系统（PMIS）是整合管理的重要工具，属于___的一部分。',
    answer: '事业环境因素',
    analysis: 'PMIS 包括进度管理软件、配置管理系统、信息收集与分发工具，属于组织的事业环境因素。',
    keywords: ['PMIS', '事业环境因素', '项目管理信息系统'],
  },
  {
    id: 'int-012',
    category: 'integration',
    question: '经验教训知识库是组织过程资产的重要内容，应在___过程中更新并在项目收尾时正式归档。',
    answer: '整个项目执行过程（各阶段）',
    analysis: '经验教训应在整个项目期间持续收集，不仅限于项目结束时，最终在收尾时形成正式文件。',
    keywords: ['整个项目', '项目期间', '各阶段', '持续', '全程'],
  },
  {
    id: 'int-013',
    category: 'integration',
    question: '整体变更控制中，已批准的变更请求会更新___，以反映批准的变更对项目基准的影响。',
    answer: '项目管理计划和项目文件',
    analysis: '变更批准后须更新受影响的计划（如进度基准、成本基准）和相关项目文件。',
    keywords: ['项目管理计划', '项目文件', '基准'],
  },
  {
    id: 'int-014',
    category: 'integration',
    question: '制定项目管理计划时，应遵循"___"原则，确保各子计划之间协调一致、相互支持。',
    answer: '渐进明细',
    analysis: '渐进明细意味着随着项目信息不断丰富，计划可以逐步细化，但各子计划须保持一致性。',
    keywords: ['渐进明细'],
  },
  {
    id: 'int-015',
    category: 'integration',
    question: '实施整体变更控制时，对于紧急情况可先实施变更，但事后必须补充完成___。',
    answer: '正式的变更申请和审批手续',
    analysis: '即使是紧急变更，也需要在实施后补充正式文件，以维护变更控制记录的完整性。',
    keywords: ['变更申请', '审批'],
  },

  // ============================================================
  // 【范围管理】 ~18题
  // ============================================================
  {
    id: 'sco-001',
    category: 'scope',
    question: '范围管理的核心输出文件中，___用于描述项目可交付成果及产生这些成果所需的工作。',
    answer: '项目范围说明书',
    analysis: '项目范围说明书是项目范围的书面描述，详细定义了项目边界、可交付成果和验收准则。',
    keywords: ['项目范围说明书'],
  },
  {
    id: 'sco-002',
    category: 'scope',
    question: 'WBS（工作分解结构）将项目可交付成果分解为更小、更易管理的组成部分，WBS 的最底层称为___。',
    answer: '工作包',
    analysis: '工作包是WBS的最低层级，可以据此制定进度计划和成本估算，并进行控制。',
    keywords: ['工作包'],
  },
  {
    id: 'sco-003',
    category: 'scope',
    question: '范围基准由项目范围说明书、WBS 和___三个部分组成。',
    answer: 'WBS词典',
    analysis: 'WBS词典为每个WBS组件提供详细的描述，三者共同构成范围基准。',
    keywords: ['WBS词典'],
  },
  {
    id: 'sco-004',
    category: 'scope',
    question: '确认范围过程的主要输出是___，而非质量控制过程中的核实可交付成果。',
    answer: '验收的可交付成果',
    analysis: '确认范围侧重于干系人对可交付成果的正式验收；质量控制侧重于检查成果是否符合质量要求。',
    keywords: ['验收的可交付成果', '确认范围'],
  },
  {
    id: 'sco-005',
    category: 'scope',
    question: '收集需求的技术包括访谈、焦点小组、引导式研讨会（如___）、头脑风暴等。',
    answer: 'JAD（联合应用开发）',
    analysis: 'JAD（Joint Application Development）是一种引导式研讨会技术，让用户和开发人员共同定义需求。',
    keywords: ['JAD', '联合应用开发', '引导式研讨会'],
  },
  {
    id: 'sco-006',
    category: 'scope',
    question: '控制范围时，若发现实际工作超出了批准的范围，这种现象称为___。',
    answer: '范围蔓延（黄金镀层/镀金）',
    analysis: '范围蔓延指未经变更控制审批而扩大项目范围；镀金指超出客户要求额外提供功能，两者均不可取。',
    keywords: ['范围蔓延', '镀金'],
  },
  {
    id: 'sco-007',
    category: 'scope',
    question: '需求跟踪矩阵（RTM）将需求与其来源及整个项目生命周期的___关联起来。',
    answer: '满足需求的可交付成果',
    analysis: 'RTM追踪需求从业务目标→项目范围→WBS→测试验收的全程，确保每个需求都被实现和验证。',
    keywords: ['需求跟踪矩阵', 'RTM'],
  },
  {
    id: 'sco-008',
    category: 'scope',
    question: '规划范围管理过程的主要输出是___和需求管理计划。',
    answer: '范围管理计划',
    analysis: '范围管理计划描述了如何定义、确认和控制项目范围；需求管理计划描述如何收集和管理需求。',
    keywords: ['范围管理计划'],
  },
  {
    id: 'sco-009',
    category: 'scope',
    question: 'WBS的分解原则是"___"，即将项目分解到足以进行有效管理和控制的层级。',
    answer: '100% 规则',
    analysis: '100%规则：WBS包含项目全部范围，且不超出项目范围，父层所有工作等于子层工作之和。',
    keywords: ['100%规则', '100%'],
  },
  {
    id: 'sco-010',
    category: 'scope',
    question: '在敏捷项目中，需求通常以___的形式收集，并放入产品待办列表（Product Backlog）中。',
    answer: '用户故事',
    analysis: '用户故事（User Story）是敏捷方法中描述需求的常用格式：作为<角色>，我想要<功能>，以便<价值>。',
    keywords: ['用户故事', 'User Story'],
  },
  {
    id: 'sco-011',
    category: 'scope',
    question: '确认范围与质量控制的区别在于：确认范围关注可交付成果的___，质量控制关注可交付成果的正确性。',
    answer: '验收（客户接受度）',
    analysis: '确认范围是客户或发起人验收并正式接受；质量控制是项目团队对内部质量标准的检查。',
    keywords: ['验收', '接受'],
  },
  {
    id: 'sco-012',
    category: 'scope',
    question: '范围管理中，项目范围是指___，产品范围是指产品、服务或成果所具有的特性和功能。',
    answer: '为交付具有规定特性与功能的产品、服务或成果而必须完成的工作',
    analysis: '项目范围指"做什么"（工作），产品范围指"交付什么"（成果特性）。',
    keywords: ['项目范围', '工作', '产品范围'],
  },

  // ============================================================
  // 【时间管理（进度管理）】 ~18题
  // ============================================================
  {
    id: 'tim-001',
    category: 'time',
    question: '关键路径法（CPM）中，关键路径上的活动总浮动时间为___。',
    answer: '0',
    analysis: '关键路径是项目最长的路径，路径上的活动没有任何时间余地（总浮动=0），任何延迟都会导致项目延期。',
    keywords: ['0', '零', '关键路径'],
  },
  {
    id: 'tim-002',
    category: 'time',
    question: '进度压缩技术中，___是在不缩减项目范围的前提下，通过增加资源来缩短关键路径上活动的工期。',
    answer: '赶工（Crashing）',
    analysis: '赶工通过增加额外资源（人员、加班等）来压缩工期，但会增加成本。与快速跟进不同。',
    keywords: ['赶工', 'Crashing'],
  },
  {
    id: 'tim-003',
    category: 'time',
    question: '进度压缩中，___是将正常情况下顺序进行的活动改为并行进行，可能增加返工风险。',
    answer: '快速跟进（Fast Tracking）',
    analysis: '快速跟进将顺序活动改为并行，不增加成本但会增加风险（尤其是返工风险）。',
    keywords: ['快速跟进', 'Fast Tracking'],
  },
  {
    id: 'tim-004',
    category: 'time',
    question: '活动排序的方法包括前导图法（PDM）和___法，其中 PDM 中最常用的逻辑关系是完成到开始（FS）。',
    answer: '箭线图（ADM）',
    analysis: 'PDM（节点法）是目前最常用的排序方法；ADM（箭线图）较老，只支持FS关系。',
    keywords: ['箭线图', 'ADM'],
  },
  {
    id: 'tim-005',
    category: 'time',
    question: '挣值分析中，SPI < 1 表示项目___，SPI = EV / PV。',
    answer: '进度落后（进度绩效不佳）',
    analysis: 'SPI（进度绩效指数）= EV/PV。SPI<1说明实际完成进度落后于计划；SPI>1说明进度超前。',
    keywords: ['进度落后', 'SPI'],
  },
  {
    id: 'tim-006',
    category: 'time',
    question: '三点估算中，期望工期 te = (O + 4M + P) / 6，其中 O、M、P 分别代表___、最可能时间和悲观时间。',
    answer: '乐观时间',
    analysis: '三点估算基于PERT分布：O=乐观（最好情况），M=最可能，P=悲观（最坏情况）。',
    keywords: ['乐观时间', 'O'],
  },
  {
    id: 'tim-007',
    category: 'time',
    question: '制定进度计划的输出包括项目进度计划、进度基准、进度数据和___。',
    answer: '项目日历',
    analysis: '项目日历标明可以开展工作的工作日和非工作日，是制定进度计划时的重要输出。',
    keywords: ['项目日历'],
  },
  {
    id: 'tim-008',
    category: 'time',
    question: '进度管理中，活动之间的依赖关系分为强制性依赖（硬逻辑）、选择性依赖（软逻辑）和___。',
    answer: '外部依赖',
    analysis: '外部依赖指项目活动与非项目活动之间的关系，如等待政府审批。还有内部依赖（项目内控制）。',
    keywords: ['外部依赖'],
  },
  {
    id: 'tim-009',
    category: 'time',
    question: '资源平衡的结果通常是___，因为需要在资源限制下重新安排工期。',
    answer: '项目工期延长',
    analysis: '资源平衡在资源有限时调整工期，可能导致关键路径改变；资源平滑不改变关键路径和工期。',
    keywords: ['工期延长', '延长'],
  },
  {
    id: 'tim-010',
    category: 'time',
    question: '关键链法在进度计划中引入了___的概念，通过在项目末尾和各供给点设置缓冲来保护项目工期。',
    answer: '缓冲（Buffer）',
    analysis: '关键链法考虑资源限制，在关键链末尾设置项目缓冲，在汇入关键链的支链末尾设置汇入缓冲。',
    keywords: ['缓冲', 'Buffer'],
  },
  {
    id: 'tim-011',
    category: 'time',
    question: '进度网络中，活动的最早完成时间（EF）= 最早开始时间（ES）+ ___。',
    answer: '活动工期（Duration）',
    analysis: 'EF = ES + Duration；最晚开始（LS）= 最晚完成（LF）- Duration；总浮动 = LS - ES = LF - EF。',
    keywords: ['活动工期', '工期'],
  },
  {
    id: 'tim-012',
    category: 'time',
    question: '控制进度过程通过比较实际进度与进度基准，当发现偏差时可能需要提出___。',
    answer: '变更请求',
    analysis: '当进度偏差超出阈值时，需提出变更请求，经整体变更控制批准后更新进度基准。',
    keywords: ['变更请求'],
  },

  // ============================================================
  // 【成本管理】 ~18题
  // ============================================================
  {
    id: 'cos-001',
    category: 'cost',
    question: '挣值管理（EVM）中，CPI = EV / AC，当 CPI < 1 时，表示项目___。',
    answer: '成本超支（成本绩效不佳）',
    analysis: 'CPI（成本绩效指数）<1说明实际花费高于完成工作的预算，即成本超支；CPI>1说明成本节约。',
    keywords: ['成本超支', '超支', 'CPI'],
  },
  {
    id: 'cos-002',
    category: 'cost',
    question: '完工估算（EAC）最常用的公式是 EAC = BAC / ___，假设未来绩效与过去相同。',
    answer: 'CPI',
    analysis: 'EAC = BAC/CPI 是最常用的完工估算公式，适用于当前绩效指数代表未来趋势的情况。',
    keywords: ['CPI', 'BAC'],
  },
  {
    id: 'cos-003',
    category: 'cost',
    question: '预算的制定过程中，项目预算 = 成本基准 + ___，用于应对已识别的不确定性风险以外的风险。',
    answer: '管理储备',
    analysis: '管理储备不在成本基准中，由高层管理者掌控，用于应对未知-未知风险；应急储备在成本基准中。',
    keywords: ['管理储备'],
  },
  {
    id: 'cos-004',
    category: 'cost',
    question: '成本估算的常用方法中，___是利用历史项目数据来估算当前项目成本的方法。',
    answer: '类比估算',
    analysis: '类比估算（Analogous Estimating）使用历史项目实际数据作为当前项目的估算基础，速度快但精度低。',
    keywords: ['类比估算'],
  },
  {
    id: 'cos-005',
    category: 'cost',
    question: '成本基准是经过批准的，按时间段分配的项目预算，不包括___。',
    answer: '管理储备',
    analysis: '成本基准 = 工作包成本 + 应急储备。管理储备是在成本基准之外的预算，不包含在基准中。',
    keywords: ['管理储备'],
  },
  {
    id: 'cos-006',
    category: 'cost',
    question: '完工尚需绩效指数（TCPI）= (BAC - EV) / (BAC - ___) 时，代表基于剩余预算完成剩余工作。',
    answer: 'AC',
    analysis: 'TCPI = (BAC-EV)/(BAC-AC)，若基于EAC则为(BAC-EV)/(EAC-AC)。TCPI>1表示需要更高效率才能完工。',
    keywords: ['AC', 'TCPI'],
  },
  {
    id: 'cos-007',
    category: 'cost',
    question: '参数估算是利用历史数据建立统计关系来估算成本，例如按___乘以单价来估算软件项目成本。',
    answer: '代码行数（KLOC）或功能点',
    analysis: '参数估算通过数学模型（如回归分析）建立成本与参数之间的关系，精度高于类比估算。',
    keywords: ['参数估算', '代码行数', '功能点'],
  },
  {
    id: 'cos-008',
    category: 'cost',
    question: '在挣值分析中，EV（挣值）= 完成工作的___。',
    answer: '计划价值（预算成本）',
    analysis: 'EV = 已完成工作的计划费用，体现了"应该花多少钱来完成这些工作"，不是实际花费。',
    keywords: ['计划价值', '预算成本'],
  },
  {
    id: 'cos-009',
    category: 'cost',
    question: '生命周期成本分析（LCC）不仅考虑项目开发成本，还包括运维、处置等___阶段的成本。',
    answer: '使用和处置（全生命周期）',
    analysis: '生命周期成本=获取成本+运营成本+维护成本+处置成本，帮助决策者做出更全面的成本决策。',
    keywords: ['生命周期', '全生命周期', '运营'],
  },
  {
    id: 'cos-010',
    category: 'cost',
    question: '成本管理中，应急储备是为___预留的预算，包含在成本基准中。',
    answer: '已识别风险（已知-未知风险）',
    analysis: '应急储备针对已识别风险，属于成本基准的一部分；管理储备针对未知-未知风险，在基准之外。',
    keywords: ['应急储备', '已识别风险'],
  },

  // ============================================================
  // 【质量管理】 ~15题
  // ============================================================
  {
    id: 'qua-001',
    category: 'quality',
    question: '质量管理中，___是防止将不合格产品交付给客户的关键活动，发生在执行阶段。',
    answer: '质量控制（QC）',
    analysis: '质量控制（QC）检查可交付成果，找出缺陷；质量保证（QA）审计质量过程，确保过程符合标准。',
    keywords: ['质量控制', 'QC'],
  },
  {
    id: 'qua-002',
    category: 'quality',
    question: '质量成本（COQ）包括一致性成本和非一致性成本，其中___包括预防成本和评价成本。',
    answer: '一致性成本（合格成本）',
    analysis: '一致性成本=预防成本（培训、测试、审查）+评价成本（检查、测试）；非一致性成本=内/外部失败成本。',
    keywords: ['一致性成本', '合格成本', '预防成本', '评价成本'],
  },
  {
    id: 'qua-003',
    category: 'quality',
    question: '七种基本质量工具中，___图用于显示随时间变化的过程数据，帮助确定过程是否受控。',
    answer: '控制图',
    analysis: '控制图（Control Chart）用上下控制限来监测过程，当数据点超出控制限时，说明过程失控。',
    keywords: ['控制图'],
  },
  {
    id: 'qua-004',
    category: 'quality',
    question: '质量管理的基本原则之一是___，即"第一次就把事情做对"，强调预防优于检查。',
    answer: '零缺陷（做好设计）',
    analysis: '克劳士比提出"零缺陷"理念，质量的代价在于不符合要求，预防缺陷比事后修复代价更低。',
    keywords: ['零缺陷', '预防'],
  },
  {
    id: 'qua-005',
    category: 'quality',
    question: '帕累托图（排列图）基于___原则，显示最重要的缺陷或问题的频率分布。',
    answer: '80/20 原则',
    analysis: '帕累托原则：80%的问题来源于20%的原因，帕累托图按频率降序排列，帮助聚焦关键问题。',
    keywords: ['80/20', '帕累托'],
  },
  {
    id: 'qua-006',
    category: 'quality',
    question: '质量保证（QA）通过___来评估质量过程，确保项目使用符合标准的质量过程。',
    answer: '质量审计',
    analysis: '质量审计是对质量活动的结构化、独立审查，识别正在使用的低效或无效的质量政策和过程。',
    keywords: ['质量审计'],
  },
  {
    id: 'qua-007',
    category: 'quality',
    question: '在控制图中，当连续___个或更多数据点落在均值的同侧时，表明过程可能出现特殊原因变异。',
    answer: '7',
    analysis: '控制图的"七点规则"：7个连续点在均值同侧表明过程受特殊原因影响，需要调查，即使未超出控制限。',
    keywords: ['7', '七点'],
  },
  {
    id: 'qua-008',
    category: 'quality',
    question: '鱼骨图（因果图/石川图）用于识别质量问题的___，通常从"人机料法环测"六个维度分析。',
    answer: '根本原因',
    analysis: '鱼骨图通过系统地列出可能导致问题的原因，帮助团队识别质量问题的根本原因。',
    keywords: ['根本原因', '原因'],
  },
  {
    id: 'qua-009',
    category: 'quality',
    question: '规划质量管理的主要输出是___，它描述了如何实施组织的质量政策。',
    answer: '质量管理计划',
    analysis: '质量管理计划描述质量目标、质量标准、质量工具和方法、职责分工等内容。',
    keywords: ['质量管理计划'],
  },
  {
    id: 'qua-010',
    category: 'quality',
    question: '在散点图中，两个变量之间的相关性越强，数据点越___（集中在一条直线附近）。',
    answer: '集中（靠近）',
    analysis: '散点图用于研究两变量之间的关系，点越集中在对角线附近，相关性越强（正或负相关）。',
    keywords: ['集中', '靠近', '线性'],
  },

  // ============================================================
  // 【人力资源管理】 ~15题
  // ============================================================
  {
    id: 'hr-001',
    category: 'human-resource',
    question: '人力资源管理中，___矩阵清晰地显示了每个人在项目中的职责，常见格式为 RACI 矩阵。',
    answer: '责任分配矩阵（RAM）',
    analysis: 'RACI矩阵明确了每个工作包的负责人（R-执行），审批人（A-负责），咨询人（C），知情人（I）。',
    keywords: ['责任分配矩阵', 'RAM', 'RACI'],
  },
  {
    id: 'hr-002',
    category: 'human-resource',
    question: '马斯洛需求层次理论将人的需求从低到高分为五层，最高层是___需求。',
    answer: '自我实现',
    analysis: '马斯洛五层需求：生理→安全→社会（归属感）→尊重→自我实现，只有满足低层需求才能追求高层需求。',
    keywords: ['自我实现'],
  },
  {
    id: 'hr-003',
    category: 'human-resource',
    question: '赫茨伯格双因素理论中，___因素（如薪酬、工作环境）的缺乏会产生不满，但提升也不会带来满足感。',
    answer: '保健（卫生）',
    analysis: '保健因素消除不满；激励因素（成就、认可、成长）才能真正激励员工，带来满足感。',
    keywords: ['保健', '卫生'],
  },
  {
    id: 'hr-004',
    category: 'human-resource',
    question: '项目团队发展的塔克曼阶梯理论包括组建→___→规范→表现→解散五个阶段。',
    answer: '震荡（风暴）',
    analysis: '塔克曼5阶段：Forming（组建）→Storming（震荡）→Norming（规范）→Performing（表现）→Adjourning（解散）。',
    keywords: ['震荡', '风暴', 'Storming'],
  },
  {
    id: 'hr-005',
    category: 'human-resource',
    question: '项目经理在矩阵型组织中通常对团队成员拥有___权力，而职能经理拥有行政和绩效考核权力。',
    answer: '有限的（任务分配/协调）',
    analysis: '在矩阵组织中，项目经理负责项目工作分配，但职能经理保留人事权（晋升、薪资、绩效）。',
    keywords: ['有限', '矩阵'],
  },
  {
    id: 'hr-006',
    category: 'human-resource',
    question: '激励团队的方法之一是___奖励，即在员工取得成果后立即给予认可，效果优于延迟奖励。',
    answer: '即时',
    analysis: '即时奖励（如当场表扬）比延迟奖励（年终奖）更有激励效果，因为与绩效的联系更紧密。',
    keywords: ['即时奖励', '即时'],
  },
  {
    id: 'hr-007',
    category: 'human-resource',
    question: '麦克格雷戈的 X 理论认为员工天性懒惰、需要监督和强制，Y 理论认为员工具有___的主动性。',
    answer: '自我激励和自我控制',
    analysis: 'Y理论认为工作是自然的，人能自我指引，在合适的条件下愿意承担责任，是现代管理的基础。',
    keywords: ['自我激励', '主动性', 'Y理论'],
  },
  {
    id: 'hr-008',
    category: 'human-resource',
    question: '虚拟团队的主要挑战是___，项目经理需要借助协作工具和规范的沟通计划来克服。',
    answer: '沟通和协作障碍（时区、文化差异）',
    analysis: '虚拟团队跨地域、跨时区，缺乏面对面交流，需要更多文档化沟通规范和团队凝聚力活动。',
    keywords: ['沟通', '协作', '虚拟'],
  },

  // ============================================================
  // 【沟通管理】 ~15题
  // ============================================================
  {
    id: 'com-001',
    category: 'communication',
    question: '项目沟通管理中，沟通渠道数量公式为 n(n-1)/2，10 个干系人共有___条沟通渠道。',
    answer: '45',
    analysis: '10×(10-1)/2 = 45。该公式说明随着干系人增加，沟通复杂度呈指数级增长。',
    keywords: ['45'],
  },
  {
    id: 'com-002',
    category: 'communication',
    question: '沟通方式分为正式/非正式沟通，以及口头/书面沟通，其中___沟通拥有最高的法律效力。',
    answer: '正式书面',
    analysis: '正式书面沟通（如合同、项目章程、变更请求）具有最高法律效力；非正式口头沟通效率高但无记录。',
    keywords: ['正式书面'],
  },
  {
    id: 'com-003',
    category: 'communication',
    question: '沟通管理计划中需要明确每个干系人的沟通需求，包括信息内容、发送频率和___。',
    answer: '沟通方式（渠道/媒介）',
    analysis: '沟通管理计划需要定义：谁需要什么信息、何时需要、以何种格式、通过什么渠道传递。',
    keywords: ['沟通方式', '渠道', '媒介'],
  },
  {
    id: 'com-004',
    category: 'communication',
    question: '项目报告分为状态报告、进展报告和___报告，后者用于记录项目某一时点的完整信息。',
    answer: '趋势',
    analysis: '状态报告描述当前状况；进展报告描述阶段完成情况；趋势报告分析一段时间内的绩效趋势。',
    keywords: ['趋势报告'],
  },
  {
    id: 'com-005',
    category: 'communication',
    question: '有效的倾听技术包括积极倾听，即通过___来确认自己对发言者意思的理解是否正确。',
    answer: '释义（复述/确认）',
    analysis: '积极倾听包括：保持眼神接触、不打断、释义确认、询问澄清问题、控制情绪反应。',
    keywords: ['释义', '复述', '确认'],
  },
  {
    id: 'com-006',
    category: 'communication',
    question: '信息分发时，拉式沟通适用于面向___受众的大量信息，如内容发布到门户网站供其自行访问。',
    answer: '大规模（大量）',
    analysis: '推式沟通（邮件/报告）主动发送给特定人；拉式沟通（网站/共享平台）让接收者主动获取。',
    keywords: ['大规模', '大量', '拉式'],
  },
  {
    id: 'com-007',
    category: 'communication',
    question: '在面对面沟通中，___部分的信息（如语气、肢体语言）往往比语言内容传递更多的含义。',
    answer: '非语言（语调和肢体语言）',
    analysis: '梅拉宾研究表明：语言内容仅传递7%信息，语调38%，肢体语言55%，非语言沟通极为重要。',
    keywords: ['非语言', '肢体语言', '语调'],
  },

  // ============================================================
  // 【风险管理】 ~15题
  // ============================================================
  {
    id: 'ris-001',
    category: 'risk',
    question: '风险的两个关键属性是___和影响，风险矩阵将两者结合来确定风险优先级。',
    answer: '概率（可能性）',
    analysis: '风险 = 概率 × 影响。概率-影响矩阵将风险按发生概率和潜在影响分类，确定应对优先级。',
    keywords: ['概率', '可能性'],
  },
  {
    id: 'ris-002',
    category: 'risk',
    question: '负面风险（威胁）的应对策略包括规避、转移、减轻和___。',
    answer: '接受',
    analysis: '四种威胁应对：规避（消除原因）、转移（保险/外包）、减轻（降低概率/影响）、接受（被动/主动储备）。',
    keywords: ['接受'],
  },
  {
    id: 'ris-003',
    category: 'risk',
    question: '正面风险（机会）的应对策略包括开拓、增强、分享和___。',
    answer: '接受',
    analysis: '四种机会应对：开拓（确保机会实现）、增强（提高概率/影响）、分享（与他人共享）、接受（不主动追求）。',
    keywords: ['接受'],
  },
  {
    id: 'ris-004',
    category: 'risk',
    question: '风险登记册是风险识别过程的主要输出，记录每个已识别风险的___、类别、根本原因和潜在应对措施。',
    answer: '描述',
    analysis: '风险登记册随项目进展不断更新，包含风险描述、分类、概率、影响、应对措施、责任人等。',
    keywords: ['描述', '风险登记册'],
  },
  {
    id: 'ris-005',
    category: 'risk',
    question: '定量风险分析中，___模拟通过对风险变量进行大量随机抽样来评估风险对项目目标的总体影响。',
    answer: '蒙特卡洛',
    analysis: '蒙特卡洛模拟对每个风险变量进行数千次随机抽样，生成项目成本/工期的概率分布。',
    keywords: ['蒙特卡洛'],
  },
  {
    id: 'ris-006',
    category: 'risk',
    question: '风险管理中，___风险是指在应对某个已知风险时可能产生的新风险。',
    answer: '次生（继发）',
    analysis: '次生风险是因为实施了某个风险应对措施而产生的新风险，如为减少一个风险引发了另一个问题。',
    keywords: ['次生', '继发'],
  },
  {
    id: 'ris-007',
    category: 'risk',
    question: '风险偏好描述组织或个人对不确定性的态度，可分为风险厌恶、风险中立和___三种类型。',
    answer: '风险偏好（喜好风险）',
    analysis: '风险厌恶者宁可损失预期收益以避免不确定性；风险偏好者愿意接受更大不确定性以获取更高回报。',
    keywords: ['风险偏好', '喜好风险'],
  },
  {
    id: 'ris-008',
    category: 'risk',
    question: '决策树分析中，每个分支节点代表一个___，每个机会节点代表一种可能的结果及其概率。',
    answer: '决策点',
    analysis: '决策树通过列出决策选项和各选项在不同情景下的结果，帮助在不确定性条件下做出最优决策。',
    keywords: ['决策点'],
  },

  // ============================================================
  // 【采购管理】 ~15题
  // ============================================================
  {
    id: 'pro-001',
    category: 'procurement',
    question: '采购管理中，___合同（成本加激励费用合同）通过将卖方成本节约与买方共享来激励卖方控制成本。',
    answer: 'CPIF',
    analysis: 'CPIF合同：买方报销成本+固定费+额外激励费，激励卖方提升效率；CPFF是成本加固定费合同。',
    keywords: ['CPIF', '成本加激励'],
  },
  {
    id: 'pro-002',
    category: 'procurement',
    question: '固定价格合同中，___合同允许按照预定义的价格调整公式对合同价格进行调整。',
    answer: 'FPEPA（固定价格加经济价格调整）',
    analysis: 'FPEPA合同适用于长期合同，通过预设通货膨胀公式保护买方和卖方免受价格波动影响。',
    keywords: ['FPEPA', '固定价格加经济价格调整'],
  },
  {
    id: 'pro-003',
    category: 'procurement',
    question: '采购文件中，___（SOW）是买方向卖方提供的对所购买内容的详细描述。',
    answer: '采购工作说明书',
    analysis: '采购工作说明书（SOW）是合同的重要组成部分，描述了所需产品/服务/成果的规格和要求。',
    keywords: ['采购工作说明书', 'SOW'],
  },
  {
    id: 'pro-004',
    category: 'procurement',
    question: '评估卖方建议时，评价标准通常不仅考虑价格，还会考虑卖方的___、技术能力和管理方法。',
    answer: '过往绩效和财务实力',
    analysis: '供应商评估准则：理解需求程度、总成本、技术能力、管理方法、过往绩效、财务实力等。',
    keywords: ['过往绩效', '财务实力', '技术能力'],
  },
  {
    id: 'pro-005',
    category: 'procurement',
    question: '在成本补偿合同中，买方承担___风险，卖方的成本超支风险转移给了买方。',
    answer: '较高的成本',
    analysis: '成本补偿合同：买方报销卖方所有实际成本，因此买方承担成本超支风险；固定价格合同则相反。',
    keywords: ['较高成本', '成本超支'],
  },
  {
    id: 'pro-006',
    category: 'procurement',
    question: '采购谈判的目标是达成___协议，双方均认为合同公平合理，有利于建立长期合作关系。',
    answer: '双赢（互利）',
    analysis: '好的采购谈判追求双赢结果，而非一方完全占优，这有助于提高卖方执行积极性和合作质量。',
    keywords: ['双赢', '互利'],
  },
  {
    id: 'pro-007',
    category: 'procurement',
    question: '控制采购过程中，当卖方未能履行合同义务时，买方可以发出___通知，这是终止合同的前置步骤。',
    answer: '违约（绩效不足）',
    analysis: '买方应先发出违约通知，给卖方改进机会，若仍无法满足要求，才可依据合同条款终止合同。',
    keywords: ['违约', '绩效不足'],
  },

  // ============================================================
  // 【干系人管理】 ~12题
  // ============================================================
  {
    id: 'sta-001',
    category: 'stakeholder',
    question: '干系人分析的常用工具是权力/利益方格，将干系人分为四类，其中对高权力、高利益的干系人应___。',
    answer: '重点管理（密切关注）',
    analysis: '权力/利益方格四象限：高权力高利益→重点管理；高权力低利益→令其满意；低权力高利益→及时告知；低权力低利益→监测。',
    keywords: ['重点管理', '密切关注'],
  },
  {
    id: 'sta-002',
    category: 'stakeholder',
    question: '干系人参与度评估矩阵将干系人参与状态分为：不知晓、抵制、中立、支持和___五个等级。',
    answer: '领导（引领）',
    analysis: '干系人参与梯度：不知晓→抵制→中立→支持→领导（主动推动项目成功）。目标是让关键干系人达到"支持"以上。',
    keywords: ['领导', '引领'],
  },
  {
    id: 'sta-003',
    category: 'stakeholder',
    question: '识别干系人过程应在___之前或同时完成，以便干系人的需求能反映在项目章程中。',
    answer: '制定项目章程',
    analysis: '干系人识别越早越好，最理想是在项目启动时与制定章程同步进行，确保所有关键需求被纳入。',
    keywords: ['制定项目章程', '项目章程'],
  },
  {
    id: 'sta-004',
    category: 'stakeholder',
    question: '管理干系人参与的目的是在整个项目生命周期中与干系人___，满足其期望和需求。',
    answer: '沟通和协作',
    analysis: '管理干系人参与通过沟通、处理问题、协商需求，提升干系人对项目的支持度。',
    keywords: ['沟通', '协作'],
  },
  {
    id: 'sta-005',
    category: 'stakeholder',
    question: '干系人登记册记录已识别干系人的信息，包括姓名、职位、___和期望等基本信息。',
    answer: '联系方式、利益/影响程度',
    analysis: '干系人登记册是干系人管理的基础文件，应记录每个干系人的基本信息、利益关切和参与策略。',
    keywords: ['利益', '影响', '联系方式'],
  },
  {
    id: 'sta-006',
    category: 'stakeholder',
    question: '在应对干系人负面影响时，最主动有效的策略是___，即在问题出现前主动识别并解决。',
    answer: '前瞻性沟通（主动参与）',
    analysis: '与其被动应对干系人反对，不如主动识别其关切点，提前参与沟通，争取理解和支持。',
    keywords: ['主动', '前瞻', '沟通'],
  },

  // ============================================================
  // 【项目管理基础 / 绩效域 / 其他】 ~20%比例，约40题
  // ============================================================
  {
    id: 'bas-001',
    category: 'project-management',
    question: '项目的三大约束是范围、时间和___，这三者相互制约，改变其中一个通常会影响其他两个。',
    answer: '成本',
    analysis: '项目铁三角（铁三角约束）：范围、时间、成本。近年来"质量"也被纳入为第四约束。',
    keywords: ['成本'],
  },
  {
    id: 'bas-002',
    category: 'project-management',
    question: '项目管理过程组包括启动、规划、执行、监控和___五个过程组。',
    answer: '收尾',
    analysis: 'PMBOK五个过程组：启动→规划→执行→监控（与执行并行）→收尾，覆盖项目全生命周期。',
    keywords: ['收尾'],
  },
  {
    id: 'bas-003',
    category: 'project-management',
    question: '项目生命周期通常分为概念/启动、开发/规划、实施/执行和___四个阶段。',
    answer: '收尾/移交',
    analysis: '典型项目生命周期：概念→开发→实施→收尾，不同行业名称略有差异，但逻辑相同。',
    keywords: ['收尾', '移交'],
  },
  {
    id: 'bas-004',
    category: 'project-management',
    question: '项目经理的核心能力包括技术能力、领导力和___三个维度，后者指理解业务战略背景。',
    answer: '战略和商业管理能力',
    analysis: '项目经理才能三角：技术项目管理技能 + 领导力 + 战略和商业管理，三者缺一不可。',
    keywords: ['战略', '商业管理'],
  },
  {
    id: 'bas-005',
    category: 'project-management',
    question: '组织结构类型中，___型组织给项目经理的授权最大，所有资源均为项目专用。',
    answer: '项目型',
    analysis: '项目型组织：项目经理有完全权威，资源专属于项目；职能型组织：项目经理权力最小；矩阵型：居中。',
    keywords: ['项目型'],
  },
  {
    id: 'bas-006',
    category: 'project-management',
    question: '项目组合管理的目标是确保选择正确的项目，使项目投资与___保持一致。',
    answer: '组织战略目标',
    analysis: '项目组合=战略对齐（选对项目）；项目集=协同管理相关项目；项目=具体交付。三个层次不同。',
    keywords: ['组织战略', '战略目标'],
  },
  {
    id: 'bas-007',
    category: 'project-management',
    question: '敏捷方法中，Scrum 的三个核心角色是产品负责人（PO）、Scrum Master 和___。',
    answer: '开发团队',
    analysis: 'Scrum三角色：PO（优先级排序）、Scrum Master（流程教练）、开发团队（自组织交付）。',
    keywords: ['开发团队'],
  },
  {
    id: 'bas-008',
    category: 'project-management',
    question: '利益相关者分析工具之一的"影响/兴趣方格"中，对高影响力、高兴趣的干系人策略是___。',
    answer: '密切合作（重点管理）',
    analysis: '与权力/利益方格类似，高影响高兴趣的干系人是最关键的，需要密切合作、频繁沟通。',
    keywords: ['密切合作', '重点管理'],
  },
  {
    id: 'bas-009',
    category: 'project-management',
    question: '冲突管理的最佳方法是___（合作/问题解决），双方共同寻找满足双方需求的解决方案。',
    answer: '协作/问题解决',
    analysis: '六种冲突解决方法效果从好到差：协作>妥协>强制>回避>缓和。协作是唯一能实现双赢的方式。',
    keywords: ['协作', '问题解决'],
  },
  {
    id: 'bas-010',
    category: 'project-management',
    question: '软考高项案例中，项目经理最重要的职责之一是识别并管理___，以确保项目成功交付。',
    answer: '项目风险',
    analysis: '项目经理的核心工作包括：制定计划、协调资源、管理风险、沟通干系人、控制变更。',
    keywords: ['项目风险', '风险'],
  },
  {
    id: 'bas-011',
    category: 'project-management',
    question: '项目启动阶段，识别干系人和制定___是两个主要过程，确定了项目存在的合法性。',
    answer: '项目章程',
    analysis: '启动过程组包含两个过程：制定项目章程（整合）和识别干系人（干系人管理）。',
    keywords: ['项目章程'],
  },
  {
    id: 'bas-012',
    category: 'project-management',
    question: '可行性研究包括技术可行性、经济可行性、___可行性和社会可行性四个方面。',
    answer: '法律（合规/政策）',
    analysis: '四类可行性：技术（能否做到）+经济（是否合算）+法律（是否合规）+社会（是否有社会效益）。',
    keywords: ['法律', '合规', '政策'],
  },
  {
    id: 'bas-013',
    category: 'project-management',
    question: '净现值（NPV）> 0 表示项目___，是决策是否投资该项目的重要依据。',
    answer: '具有投资价值（可以投资）',
    analysis: 'NPV>0说明项目产生的收益（折现值）超过投资成本，项目可以接受；NPV<0则不可投资。',
    keywords: ['投资价值', '可以投资'],
  },
  {
    id: 'bas-014',
    category: 'project-management',
    question: '立项管理中，项目建议书（立项申请）的主要内容包括项目名称、目的、___和初步实施方案。',
    answer: '预期效益（投资估算）',
    analysis: '项目建议书是立项的第一步文件，描述项目的必要性、可行性和大致方案，供决策层审批。',
    keywords: ['预期效益', '投资估算'],
  },
  {
    id: 'bas-015',
    category: 'project-management',
    question: '项目绩效域描述了成功交付项目成果所必需的关键活动领域，PMBOK第7版定义了___个绩效域。',
    answer: '8',
    analysis: 'PMBOK7版8个绩效域：干系人、团队、开发方法和生命周期、规划、项目工作、交付、测量、不确定性。',
    keywords: ['8', '八'],
  },
  {
    id: 'bas-016',
    category: 'performance-domain',
    question: '不确定性绩效域强调项目团队应具备___能力，能够在变化和模糊情况下有效决策。',
    answer: '适应性和韧性',
    analysis: '面对不确定性，团队需要保持敏捷、拥抱变化，通过渐进明细和快速反馈来应对不确定因素。',
    keywords: ['适应性', '韧性', '敏捷'],
  },
  {
    id: 'bas-017',
    category: 'performance-domain',
    question: '规划绩效域强调规划应该是___的，随着项目信息不断丰富而逐步细化，而非一次性完成。',
    answer: '迭代的（渐进明细的）',
    analysis: '规划是持续活动，特别是在敏捷项目中，规划在每个迭代周期都会进行，不是一次性完成的。',
    keywords: ['迭代', '渐进明细'],
  },
  {
    id: 'bas-018',
    category: 'performance-domain',
    question: '交付绩效域关注项目如何持续创造___，而不仅仅是完成计划内的可交付成果。',
    answer: '价值',
    analysis: 'PMBOK7版以价值为核心，交付绩效域强调每个迭代/阶段都应交付对干系人有价值的成果。',
    keywords: ['价值'],
  },
  {
    id: 'bas-019',
    category: 'project-management',
    question: '信息系统项目中，系统集成商通常承担___职责，负责将不同子系统整合为完整可运行的系统。',
    answer: '总集成商（总包商）',
    analysis: '系统集成商负责整体方案设计、子系统协调、接口集成测试，确保系统整体功能正常运行。',
    keywords: ['系统集成商', '总包', '总集成'],
  },
  {
    id: 'bas-020',
    category: 'project-management',
    question: '在信息系统项目验收时，通常需要进行___测试，以验证系统在实际环境中满足用户需求。',
    answer: '用户验收测试（UAT）',
    analysis: 'UAT（User Acceptance Testing）是用户在真实业务场景下验证系统功能，是正式上线前的最后一关。',
    keywords: ['用户验收测试', 'UAT'],
  },
]

/**
 * 按分类分组题目
 */
export const QUESTIONS_BY_CATEGORY = FILL_BLANK_QUESTIONS.reduce((acc, q) => {
  if (!acc[q.category]) acc[q.category] = []
  acc[q.category].push(q)
  return acc
}, {})

/**
 * 10大管理的 category key 列表
 */
export const TEN_MANAGEMENT_KEYS = [
  'integration', 'scope', 'time', 'cost', 'quality',
  'human-resource', 'communication', 'risk', 'procurement', 'stakeholder',
]

/**
 * 其他领域 key 列表
 */
export const OTHER_KEYS = ['project-management', 'performance-domain']

/**
 * 随机出题函数
 * @param {number} count - 题目数量
 * @returns {Array} 随机题目数组
 */
export function generateQuestions(count) {
  const mainCount = Math.round(count * 0.8)
  const otherCount = count - mainCount

  const mainPool = FILL_BLANK_QUESTIONS.filter(q => TEN_MANAGEMENT_KEYS.includes(q.category))
  const otherPool = FILL_BLANK_QUESTIONS.filter(q => OTHER_KEYS.includes(q.category))

  function pickRandom(pool, n) {
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(n, shuffled.length))
  }

  const selected = [
    ...pickRandom(mainPool, mainCount),
    ...pickRandom(otherPool, otherCount),
  ]

  // 最终打乱顺序
  return selected.sort(() => Math.random() - 0.5)
}
