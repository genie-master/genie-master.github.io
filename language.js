(() => {
  const params = new URLSearchParams(location.search);
  const chinese = params.get('lang') === 'zh';
  const toggle = document.querySelector('.language-toggle');
  toggle.textContent = chinese ? 'EN' : '中文';
  toggle.setAttribute('aria-label', chinese ? 'Switch to English' : '切换到中文');
  toggle.title = toggle.getAttribute('aria-label');
  document.documentElement.lang = chinese ? 'zh-CN' : 'en';
  toggle.addEventListener('click', () => {
    const url = new URL(location.href);
    if (chinese) url.searchParams.delete('lang');
    else url.searchParams.set('lang', 'zh');
    sessionStorage.setItem('language-switch-scroll', String(window.scrollY));
    location.href = url.href;
  });
  const savedScroll = sessionStorage.getItem('language-switch-scroll');
  if (savedScroll !== null) {
    sessionStorage.removeItem('language-switch-scroll');
    requestAnimationFrame(() => window.scrollTo(0, Number(savedScroll)));
  }
  if (!chinese) return;

  const translations = new Map(Object.entries({
    'GenieMaster | Embodied Execution Protocol': 'GenieMaster | 具身执行协议',
    'Page sections': '页面章节', 'Paper': '论文', 'Code': '代码', 'Coming soon': '即将发布',
    'GenieMaster: An Embodied Continual Harness for Persistent Multi-Robot Work': 'GenieMaster：面向持久化多机器人工作的具身持续演进框架',
    'Project links': '项目链接', 'Project video': '项目视频', 'Contents': '目录',
    'At a glance': '概览', 'Persistent work': '持久化工作', 'Multimodal guidance': '多模态引导',
    'EEP contracts': 'EEP 契约', 'Contracts': '契约', 'Harness evolution': '框架持续演进',
    'Experiments': '实验', 'An interface connecting agents to the physical world.': '连接智能体与物理世界的接口。',
    'GenieMaster connects a coding agent to responsive robot policies through an Embodied Execution Protocol. The agent composes capabilities, provides policies with additional supporting information, and receives feedback from the real world. Through multi-robot collaboration, richer guidance, memory, and reflection, GenieMaster enables sustained execution of complex, long-horizon tasks in real-world environments.': 'GenieMaster 通过具身执行协议（EEP），将编程智能体连接到可响应的机器人策略。智能体组合能力、为策略提供额外的辅助信息，并获取来自真实世界的反馈。通过多机协作，以及更完善的引导、记忆与反思，GenieMaster 实现了在真实环境中持续执行复杂长程任务。',
    'The EEP defines four protocols for agent–robot interaction: capability invocation, guidance, feedback, and continuity. In real-world deployment, asynchronous reflection and memory consolidation improve subsequent guidance, assessment, and task orchestration without fine-tuning the deployed model parameters, increasing task success over time.': 'EEP 定义了智能体与机器人交互的四个协议：能力调用、引导、反馈和连续性。在真实世界部署中，通过异步反思与记忆整合，无需对已部署模型参数进行微调，即可改进后续的引导、评估和任务编排，并随着经验积累提升任务成功率。',
    'GenieMaster overview': 'GenieMaster 概览', 'Additional GenieMaster task videos': '更多 GenieMaster 任务视频',
    'Restocking': '补货', 'Handover bath towel': '递交浴巾', 'Cleaning': '清洁',
    'Tablecloth spreading': '铺桌布', 'Item retrieval': '取物', 'Hang bath towel': '悬挂浴巾',
    'Autonomous': '自主执行', 'The execution protocol': '执行协议',
    'EEP / Embodied Execution Protocol': 'EEP / 具身执行协议',
    'Embodied Execution Protocol (EEP)': '具身执行协议（EEP）',
    'EEP is the core interface between the agent and robot embodiments in GenieMaster. Inspired by the tool abstraction of Model Context Protocol (MCP), it connects capability invocation and policy guidance to physical feedback and retained task state. Domain workflows express task semantics, while embodiment implementations bind them to robot instances, calibration, and execution services. Shared descriptions, parameters, and result contracts support task assignment across multiple robots, dynamic adjustment, error recovery, and resumption.': 'EEP 是 GenieMaster 中智能体与机器人本体之间的核心接口。该协议借鉴模型上下文协议（MCP）的工具抽象，将能力调用和策略引导连接到物理反馈与保留的任务状态。领域工作流表达任务语义，本体实现则将其绑定到具体机器人、标定信息和执行服务。共享的描述、参数和结果契约支持多台机器人的任务分配、动态调整、错误恢复与继续执行。',
    'EEP architecture': 'EEP 架构', 'Persistent multi-robot work': '持久化多机器人工作',
    'Highlight / Persistent work': '亮点 / 持久化工作',
    'GenieMaster keeps physical work alive beyond a single invocation. A coding agent can divide a long-running objective across capable robots, preserve progress, and resume the next unfinished step when a task or robot changes.': 'GenieMaster 让物理工作延续到单次调用之外。编程智能体可以将长期目标分配给具备相应能力的机器人、保存进度，并在任务或机器人变化后继续下一个未完成的步骤。',
    'Persistent multi-robot work video slots': '持久化多机器人工作视频',
    'ARX multi-robot work': 'ARX 多机器人协作', 'Home scene / View 1': '家居场景 / 视角 1',
    'Home scene / View 2': '家居场景 / 视角 2', 'Home scene / view 1': '家居场景 / 视角 1',
    'Home scene / view 2': '家居场景 / 视角 2', 'Persistent work / View 4': '持久化工作 / 视角 4',
    'Persistent work / view 4': '持久化工作 / 视角 4',
    'Agent–Policy multimodal guidance': '智能体与策略间的多模态引导',
    'Highlight / Agent–Policy interface': '亮点 / 智能体与策略接口',
    'The agent turns an open-ended request into conditions a responsive policy can execute: detailed language, spatial references, and visual goals travel with the current observation so the same policy can act on new products and scenes.': '智能体将开放式请求转化为响应式策略可执行的条件：详细语言、空间参照和视觉目标与当前观测一同传递，使同一策略能够适应新商品和新场景。',
    'Agent-policy multimodal guidance video slots': '智能体与策略多模态引导视频',
    'Four contracts make persistent execution legible.': '四项契约让持久化执行清晰可控。',
    'Capability / Guidance / Feedback / Continuity': '能力 / 引导 / 反馈 / 连续性',
    'Each contract answers a different question: what can the system do, what should the policy use, what physically happened, and what must remain true when the next task arrives?': '四项契约分别回答：系统能做什么、策略应依据什么行动、物理世界发生了什么，以及下一项任务到来时哪些状态必须保留。',
    'Capability': '能力', 'Guidance': '引导', 'Feedback': '反馈', 'Continuity': '连续性',
    'Domain tools compose workflows such as navigation, pick, and place; embodiment tools bind them to a selected robot, calibration, and execution service.': '领域工具组合导航、抓取与放置等工作流；本体工具将其绑定到选定机器人、标定信息和执行服务。',
    'Task workflows / composed tools / robot capabilities': '任务工作流 / 组合工具 / 机器人能力',
    'Domain': '领域', 'Embodiment': '本体', 'Task-specialized workflows': '面向任务的工作流',
    'Domain capabilities encode what the task means. A convenience store, home, and office domain can each expose different scene vocabulary, object catalogs, safety rules, and workflows.': '领域能力定义任务的含义。便利店、家居和办公场景可以分别提供不同的场景词汇、物品目录、安全规则和工作流。',
    'Robot-specialized execution': '面向机器人的执行',
    'Embodiment capabilities encode how a robot performs the workflow. G1, G2, and ARX bind the same task intent to their own calibration, reach, sensors, navigation, and execution service.': '本体能力定义机器人如何执行工作流。G1、G2 和 ARX 将同一任务意图分别绑定到自身的标定、可达范围、传感器、导航和执行服务。',
    'Example.': '示例。',
    '“Restock the missing bottle” stays a domain-level request; the embodiment layer selects an available G1, G2, or ARX implementation and supplies the robot-specific action endpoint.': '“补齐缺失的瓶装商品”仍是领域级请求；本体层选择可用的 G1、G2 或 ARX 实现，并提供对应机器人的动作端点。',
    'The agent supplies detailed language, spatial boxes or points, and object reference images alongside observations and the subtask instruction.': '智能体连同观测和子任务指令一起，提供详细语言、空间框或点，以及物品参考图像。',
    'Language / spatial cues / object references': '语言 / 空间提示 / 物品参考图',
    'Spatial guidance.': '空间引导。',
    'A box, point, or region tells the policy where the relevant object or target is in the current image. This turns “pick the red bottle” into a grounded condition.': '框、点或区域告诉策略相关物品或目标在当前图像中的位置，让“拿起红色瓶子”成为有空间依据的条件。',
    'Visual goal conditioning.': '视觉目标条件。',
    'A reference crop or image describes what the target should look like, allowing the policy to match an unseen product by appearance rather than by a fixed category name.': '参考裁剪图或图像描述目标外观，使策略能够依据视觉特征匹配未见过的商品，而非依赖固定类别名称。',
    'Detailed language.': '详细语言。',
    'The agent can add constraints such as “grasp the neck, keep the label facing outward, and place it in the front row.”': '智能体还可以增加约束，例如“抓住瓶颈、让标签朝外，并放在前排”。',
    'Guidance contract examples': '引导契约示例',
    'Current or recent observations, state, and success/error evidence return to the agent so it can progress, revise guidance, or recover.': '当前或近期观测、状态以及成功或错误证据返回智能体，供其推进任务、调整引导或恢复执行。',
    'Observations / state / success or error': '观测 / 状态 / 成功或错误',
    'After a failed grasp, the result includes the latest frame, the attempted action, and an error reason. The agent can then retry with a new point, ask another robot to help, or mark the subtask for later recovery.': '抓取失败后，结果包含最新画面、已尝试动作和错误原因。智能体可以换一个点重试、请求另一台机器人协助，或标记子任务以便稍后恢复。',
    'Robot assignments, progress, dependencies, and unfinished work persist across invocations, enabling coordination when a task is interrupted or a robot changes.': '机器人分配、进度、依赖关系和未完成工作在多次调用之间持续保存，以便任务中断或机器人更换后继续协作。',
    'Assignments / progress / dependencies / unfinished work': '分配 / 进度 / 依赖 / 未完成工作',
    'If a robot pauses after retrieving an item, the next invocation receives the task state, completed steps, held object, and remaining dependencies. Another available robot can continue without restarting the whole plan.': '若机器人在取物后暂停，下一次调用仍能获得任务状态、已完成步骤、当前持有的物品和剩余依赖。另一台可用机器人无需重启整个计划即可接续工作。',
    'Continual harness evolution': '框架持续演进', 'Reflection and memory consolidation': '反思与记忆整合',
    'GenieMaster evolves the context used to guide, assess, and orchestrate execution while model parameters remain fixed.': 'GenieMaster 在模型参数保持不变的情况下，持续改进用于引导、评估和编排执行的上下文。',
    'Temporary memory': '临时记忆',
    'keeps compact records of objectives, observations, detector outcomes, and likely causes of failure; asynchronous reflection then turns useful patterns into reusable long-term instructions.': '简要记录目标、观测、检测结果和可能的失败原因；异步反思随后将有用的规律整理为可复用的长期指令。',
    'The loop runs outside online monitoring, so later invocations can inherit better guidance, assessment criteria, recovery steps, and coordination rules without changing the deployed policy weights.': '这一循环在在线监控之外运行，使后续调用能够继承更好的引导、评估标准、恢复步骤和协作规则，而无需更改已部署策略的权重。',
    'Execution records': '执行记录', 'Reflection': '反思', 'Review and consolidate': '回顾与整合',
    'Long-term memory': '长期记忆', 'Reusable instructions': '可复用指令',
    'Next-day planning': '次日规划', 'Guide subsequent work': '指导后续工作',
    'Learning from': '从真实部署', 'daily real-world': '中持续', 'deployment': '学习',
    'A CONTINUOUS LOOP': '持续循环', 'Long-term memory / before': '长期记忆 / 修改前',
    'Complete each item: locate, pick, return, place.': '逐项完成：定位、抓取、返回、放置。',
    'Confirm target presence and appearance before picking.': '抓取前确认目标存在并核对外观。',
    'Keep the gripper closed until placement.': '放置前保持夹爪闭合。',
    'SUCCESS': '成功', 'FAILURE': '失败', 'correction 15:08': '15:08 纠正',
    'Notebook and earphone case retrieved; both placements confirmed.': '已取回笔记本和耳机盒，并确认两者均已放置。',
    'A desk-edge object was mistaken for the earphone case; the real case remained at the bar counter. Verify the silver-white, round appearance at close range.': '误将桌边物品认作耳机盒；真正的耳机盒仍在吧台。应近距离核对其银白色、圆形的外观。',
    'The gripper opened during retraction and dropped the earphone case before delivery.': '夹爪在回撤过程中张开，耳机盒在送达前掉落。',
    'Work resumed after the action service recovered; notebook and tissues were placed.': '动作服务恢复后继续执行，完成笔记本和纸巾的放置。',
    'Long-term memory / after': '长期记忆 / 修改后',
    'Verify edge, occluded, or unclear targets at close range.': '对边缘、遮挡或不清晰的目标进行近距离确认。',
    'The earphone case is silver-white and round; nearby clutter is not a substitute.': '耳机盒是银白色且呈圆形；附近杂物不能替代目标。',
    'Pause when a person or hand enters the workspace, then recheck before resuming.': '有人或手进入工作区域时暂停，重新检查后再继续。',
    'Keep the gripper closed during retraction and travel; release only at placement.': '回撤和移动时保持夹爪闭合，仅在放置时松开。',
    'Evidence across the same execution loop': '贯穿同一执行循环的证据',
    'Experimental evaluation': '实验评估',
    '06.1 / Experimental setup and overall end-to-end performance': '06.1 / 实验设置与整体端到端表现',
    'Overall end-to-end performance': '整体端到端表现',
    'Across six real-world tasks, GenieMaster reaches 78.67% success rate (SR) and 89.71% task completion (TC). Human orchestration remains a useful upper reference, while the EEP harness substantially exceeds the vanilla VLA and dual-system baselines.': '在六项真实世界任务中，GenieMaster 的成功率（SR）达到 78.67%，任务完成度（TC）达到 89.71%。人工编排提供了有用的参考上限，而 EEP 框架显著优于原始 VLA 和双系统基线。',
    'Overall': '总体', 'Success rate (SR)': '成功率（SR）', 'Task completion (TC)': '完成度（TC）',
    'Success / completion (%)': '成功率 / 完成度（%）',
    'Overall: SR and TC by method': '总体：各方法的成功率与完成度',
    'Hosting guests: SR and TC by method': '接待访客：各方法的成功率与完成度',
    'Tablecloth spreading: SR and TC by method': '铺桌布：各方法的成功率与完成度',
    'Office-supply search: SR and TC by method': '办公用品查找：各方法的成功率与完成度',
    'Item retrieval: SR and TC by method': '取物：各方法的成功率与完成度',
    'Restocking: SR and TC by method': '补货：各方法的成功率与完成度',
    'Cleaning: SR and TC by method': '清洁：各方法的成功率与完成度',
    'Vanilla VLA': '原始 VLA', 'Vanilla': '原始', 'Dual-system': '双系统', 'Dual-': '双',
    'system': '系统', 'Human orchestration': '人工编排', 'Human': '人工', 'orchestration': '编排',
    'Performance results': '实验结果', 'Previous result': '上一项结果', 'Next demo result': '下一项演示结果',
    'Result': '结果', 'Select overall or demo results': '选择总体或各演示结果',
    'Overall is the unweighted mean across six tasks. SR and TC are scored independently; each method is evaluated on 100 trials per task.': '总体结果是六项任务的未加权平均值。SR 和 TC 分别评分；每种方法在每项任务中评估 100 次。',
    'Hosting guests': '接待访客', 'Office-supply search': '办公用品查找',
    '06.2 / Capability composition and control allocation': '06.2 / 能力组合与控制分配',
    'Capability composition and control allocation': '能力组合与控制分配',
    'As the available capability set grows from C1 to C5, success rises from 25% to 97%. Domain workflows compose reusable tools, while the harness allocates subtasks to the robot that can execute them.': '随着可用能力从 C1 扩展到 C5，成功率由 25% 提升至 97%。领域工作流组合可复用工具，框架则把子任务分配给能够执行的机器人。',
    'Cumulative capabilities': '累积能力', 'Each configuration retains the capabilities above it.': '每种配置都包含前一配置的能力。',
    'Arm control (IK)': '机械臂控制（IK）', '+ Grasp planning': '+ 抓取规划',
    '+ Guidance-trained policy': '+ 引导训练策略', '+ Object references': '+ 物品参考图',
    '+ Agent head / waist control': '+ 智能体头部 / 腰部控制',
    '100 trials per configuration / fixed-location retrieval': '每种配置 100 次试验 / 固定位置取物',
    'Cumulative capabilities / retrieval success': '累积能力 / 取物成功率',
    '06.3 / Unseen-product generalization through in-context guidance': '06.3 / 上下文引导下的未见商品泛化',
    'Unseen-product generalization through in-context guidance': '上下文引导下的未见商品泛化',
    'With EEP-guided object references, novel-product retrieval improves from 12% at 10 training SKUs to 92% at 1,000. A separately trained text-only policy reaches 20% at the same scale, showing why agent-provided guidance must be aligned with policy training.': '利用 EEP 提供的物品参考图，未见商品取物成功率从 10 个训练 SKU 时的 12% 提升到 1,000 个时的 92%。相同规模下，单独训练的纯文本策略仅达到 20%，说明智能体提供的引导必须与策略训练方式相匹配。',
    'Text-only policy': '纯文本策略', 'EEP-guided policy': 'EEP 引导策略',
    'Text-only': '纯文本', 'EEP-guided': 'EEP 引导', 'Novel products across training scales': '不同训练规模下的未见商品',
    'Seen and novel products': '已见与未见商品', 'Seen': '已见', 'Novel': '未见',
    'Training SKUs (log scale)': '训练 SKU 数（对数刻度）', 'training SKUs': '个训练 SKU',
    'Novel-product retrieval across training SKU scales': '不同训练 SKU 规模下的未见商品取物',
    'Seen versus novel products at 1,000 training SKUs': '1,000 个训练 SKU 下的已见与未见商品',
    '1,000 SKUs / EEP-guided 92% / Text-only 20%': '1,000 个 SKU / EEP 引导 92% / 纯文本 20%',
    'Novel / EEP-guided 92% / Text-only 20%': '未见商品 / EEP 引导 92% / 纯文本 20%',
    'Success rate (%)': '成功率（%）',
    '25 trials per split and policy / no navigation': '每个划分与策略各 25 次试验 / 不含导航',
    '06.4 / Learning from experience': '06.4 / 从经验中学习', 'Learning from experience': '从经验中学习',
    'Reflection improves completion-boundary alignment for six of seven detectors. With accumulated memory, orchestration success rises from 28.6% in round one to 85.7% in round five, while tool use remains in the same operating range.': '反思提高了七个检测器中六个的完成边界对齐效果。随着记忆积累，编排成功率从第一轮的 28.6% 提升到第五轮的 85.7%，工具调用量则保持在相近范围。',
    'Office-supply search with accumulated memory': '积累记忆后的办公用品查找',
    'Office-supply search over five rounds with accumulated memory': '积累记忆后的五轮办公用品查找',
    'Round 5 / SR 85.7% / Mean tool calls 65.0': '第 5 轮 / 成功率 85.7% / 平均工具调用 65.0 次',
    'Success rate': '成功率', 'Mean tool calls': '平均工具调用次数',
    'Evaluation round': '评估轮次', 'Calls / successful trial': '每次成功试验的调用次数',
    'round': '轮次', 'calls': '次调用',
    'Seven trials per round / tool calls over successful trials only': '每轮 7 次试验 / 工具调用仅统计成功试验',
    '06.6 / Persistent deployment in a convenience store': '06.6 / 便利店持久化部署',
    'Persistent deployment in a convenience store': '便利店持久化部署',
    'In a 24-hour convenience-store deployment, scheduled inspections trigger restocking, customer orders trigger retrieval, and the agent assigns available capable robots. Task state and feedback let the system resume work and route follow-ups through the same contracts used in the controlled experiments.': '在为期 24 小时的便利店部署中，定时巡检触发补货，顾客订单触发取物，智能体分配具备相应能力的可用机器人。任务状态和反馈让系统恢复未完成的工作，并通过与受控实验相同的契约安排后续任务。',
    'Persistent work deployment': '持久化工作部署', 'Read the paper': '阅读论文',
    'VIDEO': '视频', 'Your browser does not support the video tag.': '您的浏览器不支持视频播放。',
    'Paper and implementation links will be updated as they become available.': '论文与代码链接将在发布后更新。',
    'Paper PDF': '论文 PDF', 'Copy BibTeX': '复制 BibTeX',
    'Embodied continual harness for persistent multi-robot work': '面向持久化多机器人工作的具身持续演进框架',
    'Back to top ↑': '返回顶部 ↑',
    'BibTeX copied to clipboard.': 'BibTeX 已复制到剪贴板。',
    'Select the BibTeX block to copy it.': '请选择 BibTeX 内容后复制。',
    'GenieMaster project video': 'GenieMaster 项目视频',
    'Home scene, view 1': '家居场景，视角 1', 'Home scene, view 2': '家居场景，视角 2',
    'Persistent work, view 4': '持久化工作，视角 4',
    'GenieMaster connecting a coding agent, robot policies, physical feedback, and persistent work': 'GenieMaster 连接编程智能体、机器人策略、物理反馈与持久化工作',
    'GenieMaster architecture showing EEP contracts, policy guidance, feedback, continuity, and experience memory': '展示 EEP 契约、策略引导、反馈、连续性与经验记忆的 GenieMaster 架构图',
    'Examples of spatial guidance, object reference images, and detailed language guidance': '空间引导、物品参考图与详细语言引导示例',
    'Cumulative capabilities and retrieval success': '累积能力与取物成功率',
    'Success increases as GenieMaster expands from capability set C1 to C5': '随着 GenieMaster 的能力从 C1 扩展到 C5，成功率逐渐提高',
    'Product generalization': '商品泛化',
    'EEP-guided and text-only product generalization across training SKU scales': '不同训练 SKU 规模下，EEP 引导策略与纯文本策略的商品泛化表现',
    'Orchestration with accumulated memory': '积累记忆后的任务编排',
    'Orchestration success across five rounds with accumulated memory': '记忆积累后的五轮任务编排成功率',
    'Continual harness improvement loop': '框架持续改进循环',
    'Temporary memory flows through reflection and long-term memory into next-day planning, then returns to temporary memory': '临时记忆经反思成为长期记忆，再进入次日规划，并回到临时记忆，形成循环',
    'Memory consolidation examples from the office-supply search study': '办公用品查找实验中的记忆整合示例',
    'End-to-end performance': '端到端表现',
  }));

  function translate(value) {
    const trimmed = value.trim();
    const direct = translations.get(trimmed);
    if (direct) return value.replace(trimmed, direct);
    const speed = trimmed.match(/^(▶\s*)?([\d.]+x)\s*·\s*Autonomous$/);
    if (speed) return value.replace(trimmed, `${speed[1] || ''}${speed[2]} · 自主执行`);
    const video = trimmed.match(/^VIDEO (\d+)$/);
    if (video) return value.replace(trimmed, `视频 ${video[1]}`);
    const figure = trimmed.match(/^FIG\. (\d+)$/);
    if (figure) return value.replace(trimmed, `图 ${figure[1]}`);
    const result = trimmed.match(/^(.+): 100 trials per method with randomized layouts\. SR and TC are scored independently, including failed trials\.$/);
    if (result) return value.replace(trimmed, `${translations.get(result[1]) || result[1]}：每种方法在随机布局下评估 100 次。SR 和 TC 分别评分，失败试验也计入。`);
    const barReadout = trimmed.match(/^(.+) \/ (SR|TC): ([\d.]+%)$/);
    if (barReadout) return value.replace(trimmed, `${translations.get(barReadout[1]) || barReadout[1]} / ${barReadout[2]}：${barReadout[3]}`);
    const comparisonReadout = trimmed.match(/^(.+) \/ (.+): ([\d.]+%)$/);
    if (comparisonReadout) return value.replace(trimmed, `${translations.get(comparisonReadout[1]) || comparisonReadout[1]} / ${translations.get(comparisonReadout[2]) || comparisonReadout[2]}：${comparisonReadout[3]}`);
    const lineReadout = trimmed.match(/^([\d,]+) (training SKUs|round) \/ (.+): ([\d.]+)(%| calls)$/);
    if (lineReadout) return value.replace(trimmed, `${lineReadout[1]} ${lineReadout[2] === 'round' ? '轮次' : '个训练 SKU'} / ${translations.get(lineReadout[3]) || lineReadout[3]}：${lineReadout[4]}${lineReadout[5] === ' calls' ? ' 次调用' : '%'}`);
    if (trimmed.includes('correction 15:08')) return value.replace('correction 15:08', '15:08 纠正');
    return value;
  }

  function translateTree(root) {
    if (root.nodeType === Node.TEXT_NODE) {
      if (root.parentElement?.closest('script,style,pre,code')) return;
      const next = translate(root.nodeValue);
      if (next !== root.nodeValue) root.nodeValue = next;
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    if (root.matches('script,style,pre,code')) return;
    for (const attribute of ['alt', 'aria-label', 'title']) {
      if (!root.hasAttribute(attribute)) continue;
      const current = root.getAttribute(attribute);
      const next = translate(current);
      if (next !== current) root.setAttribute(attribute, next);
    }
    root.childNodes.forEach(translateTree);
  }

  translateTree(document.body);
  document.title = translate(document.title);
  document.querySelector('meta[name="description"]').content = 'GenieMaster：面向持久化多机器人工作的具身持续演进框架。';
  new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.type === 'characterData') translateTree(record.target);
      else record.addedNodes.forEach(translateTree);
    });
  }).observe(document.body, { subtree: true, childList: true, characterData: true });
})();
