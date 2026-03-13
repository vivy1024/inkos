

还是再简单介绍一下，这是根据 [宁 河图](https://linux.do/u/user2609/summary) 佬分享的 AI 写小说提示词体系工程化后的一个 CLI 工具，五个 agent 流水线自动化了流程，还能够交给OpenClaw使用自主生产。

https://linux.do/t/topic/1745762


v0.3 把这些规则从代码里提炼出来，做了三层分离：**基础护栏**（~25 条通用规则，所有题材共享）→ **题材特性**（每个题材的专属禁忌、语言铁律、节奏、审计维度）→ **用户自定义规则**（每本书独立的主角人设、数值上限、禁令覆盖）。

https://github.com/Narcooo/inkos

## 题材自定义

内置 5 个题材。

| 题材 | 自带规则 |
|------|----------|
| 玄幻 | 数值系统、战力体系、同质吞噬衰减公式、打脸/升级/收益兑现节奏 |
| 仙侠 | 修炼/悟道节奏、法宝体系、天道规则 |
| 都市 | 年代考据、商战/社交驱动、法律术语年代匹配、无数值系统 |
| 恐怖 | 氛围递进、恐惧层级、克制叙事、无战力审计 |
| 通用 | 最小化兜底 |

创建书时指定题材就行：

```bash
inkos book create --title "吞天魔帝" --genre xuanhuan
```

题材规则可以查看、复制到项目中改、或从零创建：

```bash
inkos genre list                      # 查看所有题材
inkos genre show xuanhuan             # 查看玄幻的完整规则
inkos genre copy xuanhuan             # 复制到项目中，随意改
inkos genre create wuxia --name 武侠   # 从零创建新题材
```

复制到项目后，增删禁忌、调整疲劳词、修改节奏规则、自定义语言铁律——改完下次写章自动生效。

每个题材有专属语言规则（带 ✗→✓ 示例），写手和审计员同时执行：

- **玄幻**：✗ "火元从12缕增加到24缕" → ✓ "手臂比先前有力了，握拳时指骨发紧"
- **都市**：✗ "迅速分析了当前的债务状况" → ✓ "把那叠皱巴巴的白条翻了三遍"
- **恐怖**：✗ "感到一阵恐惧" → ✓ "后颈的汗毛一根根立起来"

## 单本书规则

每本书有独立的 `book_rules.md`，建筑师 agent 创建书时自动生成，也可以随时手改。写在这里的规则注入每一章的 prompt：

```yaml
protagonist:
  name: 林烬
  personalityLock: ["强势冷静", "能忍能杀", "有脑子不是疯狗"]
  behavioralConstraints: ["不圣母不留手", "对盟友有温度但不煽情"]
numericalSystemOverrides:
  hardCap: 840000000
  resourceTypes: ["微粒", "血脉浓度", "灵石"]
prohibitions:
  - 主角关键时刻心软
  - 无意义后宫暧昧拖剧情
  - 配角戏份喧宾夺主
fatigueWordsOverride: ["瞳孔骤缩", "不可置信"]
```

主角人设锁定、数值上限、自定义禁令、疲劳词覆盖——每本书的规则独立调整，不影响题材模板。

## 19 维度审计

审计细化为 19 个维度，按题材自动启用对应的子集：

OOC检查、时间线、设定冲突、伏笔、节奏、文风、信息越界、词汇疲劳、利益链断裂、配角降智、配角工具人化、爽点虚化、台词失真、流水账、知识库污染、视角一致性、战力崩坏、数值检查、年代考据

玄幻/仙侠全 19 维度，都市 17 维度（含年代考据），恐怖 15 维度。不需要的维度不会干扰审计结果。

## 去 AI 味

- AI 标记词限频：仿佛/忽然/竟然/不禁/宛如/猛地，每 3000 字 ≤ 1 次
- 叙述者不替读者下结论，只写动作
- 禁止分析报告式语言（"核心动机""信息落差"不入正文）
- 同一意象渲染不超过两轮
- 方法论术语不入正文

词汇疲劳审计同时检测标记词密度，超标即 warning。

## 配置

所有 LLM 配置都在 `.env` 里（不在 inkos.json，避免 key 泄漏）：

```bash
# 必填
INKOS_LLM_PROVIDER=openai                        # openai / anthropic
INKOS_LLM_BASE_URL=https://api.openai.com/v1     # API 地址（支持中转站）
INKOS_LLM_API_KEY=sk-xxx                          # API Key
INKOS_LLM_MODEL=gpt-4o                            # 模型名

# 可选
# INKOS_LLM_TEMPERATURE=0.7
# INKOS_LLM_MAX_TOKENS=8192
# INKOS_LLM_THINKING_BUDGET=0                      # Anthropic 扩展思考预算
# INKOS_LLM_API_FORMAT=chat                        # chat（默认）或 responses（OpenAI Responses API）
```

OpenAI 兼容中转站只需改 `BASE_URL`。Anthropic 直连把 `PROVIDER` 改成 `anthropic`，`BASE_URL` 改成 `https://api.anthropic.com`。

## 其他

- 修订者支持 polish / rewrite / rework 三种模式
- 无数值系统的题材（都市/恐怖）不生成资源账本

## 实测

3 个题材各 3 章：玄幻（数值追踪、战力验算、资源账本全程工作）、都市（年代考据启用、法律术语匹配 2003 年语感、无数值系统）、恐怖（氛围递进、克制叙事、恐惧层级、无战力审计）。

## 安装

```bash
npm i -g @actalk/inkos
```


