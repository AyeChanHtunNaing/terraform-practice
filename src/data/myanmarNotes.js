/**
 * HashiCorp Terraform Associate (004) Study Notes in Myanmar (မြန်မာဘာသာ)
 * Complete objective-by-objective study guide covering all 8 exam domains and 342 question concepts.
 */

export const MYANMAR_OBJECTIVE_NOTES = [
  {
    id: 1,
    title: "Infrastructure as Code (IaC) with Terraform",
    shortTitle: "IaC with Terraform",
    titleMy: "Objective 1: Terraform ဖြင့် Infrastructure as Code (IaC) အခြေခံသဘောတရားများ",
    summaryMy: "IaC ဆိုတာဘာလဲ၊ Declarative vs Imperative ကွာခြားချက်၊ Immutable Infrastructure ရဲ့ အားသာချက်များနှင့် Cloud အမျိုးမျိုးတွင် အသုံးပြုနိုင်ပုံ (Multi-Cloud / Reusability)။",
    questionCount: 22,
    sections: [
      {
        heading: "၁။ Infrastructure as Code (IaC) ဆိုတာဘာလဲ?",
        explanation: "Infrastructure as Code (IaC) ဆိုသည်မှာ Servers, Database, Network, Security Group စသည့် Cloud Infrastructure များကို Cloud Console (Web GUI) ကနေ Manual click နှိပ်ပြီး ဆောက်မည့်အစား Code (Text files) အဖြစ် ရေးသားစီမံခန့်ခွဲခြင်း ဖြစ်သည်။",
        keyPoints: [
          "Human Error (လူမှားယွင်းမှု) ကို အစွမ်းကုန် လျှော့ချပေးနိုင်သည်။",
          "Git ကဲ့သို့ Version Control System တွင် Infrastructure code ကို သိမ်းဆည်းပြီး ပြောင်းလဲမှုများကို Track လိုက်နိုင်သည်။",
          "Automated Testing, CI/CD Pipeline များတွင် ထည့်သွင်း အသုံးပြုနိုင်သည်။",
          "Dev, Staging, Production စသည့် Environment များကို တူညီသော Code ဖြင့် အကြိမ်ကြိမ် အလွယ်တကူ ပြန်လည်တည်ဆောက် (Reusability) နိုင်သည်။"
        ]
      },
      {
        heading: "၂။ Declarative vs Imperative ချဉ်းကပ်ပုံ ကွာခြားချက်",
        explanation: "IaC tools များကို အဓိကအားဖြင့် Declarative နှင့် Imperative ဟူ၍ ၂ မျိုး ခွဲခြားနိုင်သည်။ Terraform သည် 'Declarative' tool ဖြစ်သည်။",
        keyPoints: [
          "Declarative (Terraform): 'What' to achieve (လိုချင်သည့် နောက်ဆုံးရလဒ် အခြေအနေ) ကိုသာ ရေးရသည်။ ဘယ်လိုအဆင့်ဆင့် ဆောက်ရမလဲဆိုတာကို Terraform Core က Cloud API နှင့် တိုက်ဆိုင်တွက်ချက်ပေးသည်။ (ဥပမာ- 'ငါ EC2 Instance ၂ လုံး လိုချင်တယ်')",
          "Imperative (Bash scripts / Ansible): 'How' to achieve (ဘယ်လိုအဆင့်ဆင့် လုပ်ဆောင်ရမလဲ) ဆိုသည့် အဆင့်ဆင့် ညွှန်ကြားချက်များကို အတိအကျ ရေးရသည်။",
          "Idempotent: Declarative ဖြစ်သောကြောင့် Code ကို အကြိမ်ကြိမ် `apply` လုပ်သော်လည်း လိုချင်သည့် target state ရောက်ပြီးပါက မလိုအပ်ဘဲ ထပ်ဆောက်ခြင်း မပြုလုပ်ပါ။"
        ],
        codeSnippet: `# Declarative Example: လိုချင်တဲ့ Resource ကို ကြေညာရုံသာ
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"
}`
      },
      {
        heading: "၃။ Immutable Infrastructure vs Mutable Infrastructure",
        explanation: "Terraform သည် အဓိကအားဖြင့် 'Immutable Infrastructure' (မပြောင်းလဲနိုင်သော အခြေခံအဆောက်အအုံ) သဘောတရားကို အားပေးသည်။",
        keyPoints: [
          "Mutable (ရိုးရာပုံစံ): ရှိပြီးသား Server ထဲသို့ SSH ဝင်ပြီး Package များ update လုပ်ခြင်း၊ Patch တင်ခြင်း (ကြာလာပါက Configuration Drift ဖြစ်ပြီး Server များ တစ်ခုနှင့်တစ်ခု မတူညီတော့ပါ)။",
          "Immutable (Terraform ပုံစံ): Server ပြင်ဆင်လိုပါက ရှိပြီးသား server ကို ပြင်မည့်အစား အသစ်တစ်ခုကို ဆောက်ပြီး အဟောင်းကို Destroy လုပ်ပစ်သည် (Recreate)။ အရာအားလုံး code အတိုင်း တိကျသေချာစေသည်။"
        ]
      },
      {
        heading: "၄။ Multi-Cloud နှင့် Service-Agnostic Workflows",
        explanation: "Terraform သည် AWS, Microsoft Azure, Google Cloud (GCP), Kubernetes, Cloudflare စသည့် Provider ပေါင်းထောင်ချီကို ထောက်ပံ့ပေးသည်။",
        keyPoints: [
          "Single Workflow: မတူညီသော Cloud Platform အားလုံးကို 'Write -> Plan -> Apply' ဟူသော တစ်ခုတည်းသော Workflow ဖြင့် စီမံခန့်ခွဲနိုင်သည်။",
          "သတိပြုရန် (Exam Trap): Terraform သည် Provider-agnostic သို့မဟုတ် Service-agnostic workflow ဖြစ်သော်လည်း 'Code ကိုယ်တိုင်က Multi-cloud သုံးမရပါ'။ AWS အတွက် ရေးထားသော HCL Code ကို Azure ပေါ်တွင် တိုက်ရိုက် Run ၍ မရပါ (Azure အတွက် `azurerm` resources များ သီးခြား ရေးပေးရသည်)။"
        ]
      }
    ],
    examTips: [
      "မေးခွန်းတွင် 'What vs How' မေးပါက Declarative သည် 'What to achieve' ဖြစ်ပြီး Terraform သည် Declarative ဖြစ်သည်ဟု ဖြေပါ။",
      "Terraform code တစ်ခုတည်းကို syntax မပြောင်းဘဲ AWS ရော Azure ရော တပြိုင်နက် deploy လုပ်လို့ရသလား မေးပါက 'False' (မရပါ)။ Provider-specific resources များကို သီးခြားစီ ရေးရပါသည်။",
      "Server များကို in-place update လုပ်မယ့်အစား အသစ်ဆောက်ပြီး အဟောင်းကို ဖျက်သည့် ပုံစံကို 'Immutable Infrastructure' ဟု ခေါ်သည်။"
    ]
  },
  {
    id: 2,
    title: "Terraform Fundamentals",
    shortTitle: "Terraform Fundamentals",
    titleMy: "Objective 2: Terraform Fundamentals နှင့် Provider များ အလုပ်လုပ်ပုံ",
    summaryMy: "Providers, Provider configuration, required_providers block, Versions, Provider Aliases, Lock File (.terraform.lock.hcl) နှင့် State အခြေခံများ။",
    questionCount: 44,
    sections: [
      {
        heading: "၁။ Terraform Providers ဆိုတာဘာလဲ?",
        explanation: "Provider ဆိုသည်မှာ Terraform နှင့် သက်ဆိုင်ရာ Cloud/Platform API များ (ဥပမာ- AWS, Azure, GCP, GitHub) ကြား ဆက်သွယ်ပေးသည့် Plugin (Executable Binary) ဖြစ်သည်။",
        keyPoints: [
          "Terraform Core တွင် Cloud Provider များ ပါမလာပါ။ `terraform init` run သောအခါမှ Terraform Registry ကနေ သီးခြား download ဆွဲတင်ပါသည်။",
          "Providers များကို HashiCorp Official, Partner, နှင့် Community Providers ဟူ၍ ၃ မျိုး တွေ့နိုင်သည်။"
        ]
      },
      {
        heading: "၂။ required_providers Block နှင့် Version Constraints",
        explanation: "Terraform block ထဲတွင် မည်သည့် Provider ကို သုံးမည်၊ source နှင့် version ဘယ်လောက်ဖြစ်ရမည်ကို သတ်မှတ်သည်။",
        keyPoints: [
          "Source: Hostname/Namespace/Type ပုံစံဖြင့် ရေးရသည် (ဥပမာ- `hashicorp/aws` သို့မဟုတ် `registry.terraform.io/hashicorp/aws`)။",
          "`~> 2.0`: Pessimistic constraint ဟုခေါ်ပြီး `2.0` ကနေ `2.x` အထိ minor updates များကိုသာ လက်ခံပြီး `3.0` (Major breaking change) ကို လက်မခံပါ။",
          "`>= 1.0, < 2.0`: Version 1.0 နှင့်အထက်၊ Version 2.0 အောက်ဟု သတ်မှတ်ခြင်း။"
        ],
        codeSnippet: `terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}`
      },
      {
        heading: "၃။ Provider Aliases (Multiple Regions / Accounts)",
        explanation: "Cloud Provider တစ်ခုတည်းကို Region မတူညီဘဲ သုံးချင်သည့်အခါ သို့မဟုတ် Account မတူဘဲ သုံးချင်သည့်အခါ Provider Alias ကို သုံးရသည်။",
        keyPoints: [
          "Default provider တွင် alias မပါပါ။",
          "ထပ်မံခေါ်ယူသော provider တွင် `alias = \"west\"` ဟု သတ်မှတ်ပေးရသည်။",
          "Resource များတွင် `provider = aws.west` ဟု ညွှန်ပြပေးရသည်။"
        ],
        codeSnippet: `provider "aws" {
  region = "us-east-1"
}

provider "aws" {
  alias  = "west"
  region = "us-west-2"
}

resource "aws_s3_bucket" "b" {
  provider = aws.west
  bucket   = "my-west-bucket"
}`
      },
      {
        heading: "၄။ Dependency Lock File (.terraform.lock.hcl)",
        explanation: "`.terraform.lock.hcl` သည် သုံးစွဲထားသော Provider versions များနှင့် Cryptographic Checksums (Hashes) များကို မှတ်တမ်းတင်ထားသည့် ဖိုင်ဖြစ်သည်။",
        keyPoints: [
          "`terraform init` run သောအခါ အလိုအလျောက် ထွက်ပေါ်လာသည်။",
          "အသင်းသားများအားလုံး တူညီသော Provider Version အတိအကျကို သုံးစွဲနိုင်ရန် ဤ Lock file ကို Git (VCS) ထဲသို့ Commit လုပ်ရမည်။",
          "Provider version အသစ်သို့ upgrade လုပ်ချင်ပါက `terraform init -upgrade` command ကို သုံးရသည်။"
        ]
      }
    ],
    examTips: [
      "`.terraform.lock.hcl` ကို Git ထဲ commit လုပ်ရမလား မေးပါက: 'Yes, it should be committed to version control' ဟု ဖြေပါ။",
      "Region ၂ ခုတွင် resource deploy လုပ်ရန် ဘာလိုသလဲ မေးပါက: 'Provider Aliases (alias parameter)' ဟု ဖြေပါ။",
      "`~> 1.2.0` ဆိုသည်မှာ `1.2.0` ကနေ `1.2.9` အထိ ရပြီး `1.3.0` မရပါ (patch level သာ ခွင့်ပြု)။ `~> 1.2` ဆိုလျှင် `1.2` ကနေ `1.9` အထိ ရသည် (minor level ခွင့်ပြု)။"
    ]
  },
  {
    id: 3,
    title: "Core Terraform Workflow",
    shortTitle: "Core Workflow",
    titleMy: "Objective 3: Core Terraform Workflow (Init, Plan, Apply, Destroy)",
    summaryMy: "Core Workflow အဆင့် ၄ ဆင့်၊ terraform init, plan, apply, validate, fmt, plan files (-out), -replace, -destroy, moved blocks နှင့် Import workflow။",
    questionCount: 59,
    sections: [
      {
        heading: "၁။ အခြေခံ Core Workflow အဆင့်များ",
        explanation: "Terraform တွင် အဓိက အဆင့် ၃ ဆင့် (သို့မဟုတ် ၄ ဆင့်) ရှိသည်: Write -> Init -> Plan -> Apply။",
        keyPoints: [
          "1. Write: HCL syntax ဖြင့် Infrastructure configuration code များ ရေးသားခြင်း။",
          "2. Init (`terraform init`): Providers, modules, remote backend များကို download လုပ်ပြီး working directory ကို initialize လုပ်ခြင်း။",
          "3. Plan (`terraform plan`): လက်ရှိ Cloud အခြေအနေနှင့် ရေးထားသော Code ကို နှိုင်းယှဉ်ပြီး ဘာတွေ ပြောင်းလဲမည်ကို Preview ကြည့်ခြင်း (Speculative Execution)။",
          "4. Apply (`terraform apply`): Plan အတိုင်း Cloud ပေါ်တွင် အမှန်တကယ် ဆောက်လုပ်ခြင်း (သို့မဟုတ် ပြင်ဆင်ခြင်း)။"
        ]
      },
      {
        heading: "၂။ အဓိက CLI Commands များ အလုပ်လုပ်ပုံ",
        explanation: "စာမေးပွဲတွင် ဤ command တစ်ခုချင်းစီ၏ တာဝန်နှင့် behavior များကို အဓိက မေးလေ့ရှိသည်။",
        keyPoints: [
          "`terraform init`: အသစ်စတင်သည့်အခါ သို့မဟုတ် provider/module အသစ်ထည့်သည့်အခါ အမြဲ run ရသည်။ Cloud credential မလိုပါ။",
          "`terraform validate`: Code ၏ Syntax နှင့် Internal Attribute များကို စစ်ဆေးသည်။ Cloud API ကို ဆက်သွယ်စရာ မလိုသလို Credential လည်း မလိုပါ။ (Syntax check only)",
          "`terraform fmt`: Code များကို HashiCorp canonical standard အတိုင်း spacing, indentations များကို အလိုအလျောက် သပ်ရပ်အောင် ပြင်ပေးသည် (`-check` ဖြင့် စစ်ရုံသာ စစ်နိုင်သည်)။",
          "`terraform plan`: ဘာမှ အမှန်တကယ် မဆောက်ပါ (Dry-run)။ `+` (Create), `~` (Update in-place), `-` (Destroy), `-/+` (Replace) ဟု ပြပေးသည်။",
          "`terraform plan -out=tfplan`: ထွက်လာသော execution plan ကို binary file အဖြစ် သိမ်းဆည်းသည်။",
          "`terraform apply tfplan`: သိမ်းထားသော plan အတိုင်း အတိအကျ apply လုပ်သည် (Confirm prompt မတောင်းတော့ပါ)။"
        ]
      },
      {
        heading: "၃။ -replace Flag နှင့် Destroy Command",
        explanation: "တစ်ခါတစ်ရံ Resource တစ်ခုကို မပျက်စီးသော်လည်း အသစ်ပြန်ဆောက် (recreate) ချင်သည့်အခါမျိုးတွင် သုံးသည်။",
        keyPoints: [
          "`terraform apply -replace=\"aws_instance.web\"`: သတ်မှတ် resource တစ်ခုတည်းကို ဖျက်ပြီး အသစ်ပြန်ဆောက်စေသည် (ယခင် `terraform taint` အစား သုံးရသည်)။",
          "`terraform destroy`: State file ထဲရှိ resources အားလုံးကို Cloud ပေါ်မှ ဖျက်ပစ်သည်။",
          "`terraform plan -destroy`: အားလုံးကို ဖျက်ပါက ဘာတွေ ပျက်သွားမည်ကို preview ကြည့်ခြင်း။"
        ]
      },
      {
        heading: "၄။ moved Blocks (Refactoring Without Destroying)",
        explanation: "Terraform 1.1 တွင် စတင်ပါဝင်လာပြီး Code ထဲတွင် Resource name သို့မဟုတ် Module name ကို ပြောင်းလဲသည့်အခါ Cloud ပေါ်က Resource မပျက်ဘဲ State ထဲတွင် အမည်ပြောင်းသွားစေရန် သုံးသည်။",
        keyPoints: [
          "ယခင်က `terraform state mv` command ကို manual ရိုက်ရသည်။",
          "ယခုအခါ `moved { from = ... to = ... }` block ဖြင့် declarative ရေးသားနိုင်သဖြင့် Git ထဲတွင် အသင်းသားအားလုံးအတွက် အဆင်ပြေစေသည်။"
        ],
        codeSnippet: `moved {
  from = aws_instance.web
  to   = aws_instance.server
}`
      },
      {
        heading: "၅။ Partial Apply Failures (တစ်ဝက်တစ်ပျက် ကျရှုံးမှု)",
        explanation: "Terraform apply လုပ်နေစဉ် Network ပြတ်သွားခြင်း သို့မဟုတ် Resource တစ်ခု error တက်သွားပါက ဘာဖြစ်မလဲ?",
        keyPoints: [
          "Terraform သည် အလိုအလျောက် Rollback မလုပ်ပါ။ (No automatic rollback)",
          "အောင်မြင်သွားသမျှ Resources များကို `terraform.tfstate` ထဲသို့ ချက်ချင်း သိမ်းဆည်းလိုက်သည်။",
          "ပြဿနာကို ဖြေရှင်းပြီးနောက် `terraform apply` ကို နောက်တစ်ကြိမ် ထပ်မံ run ရုံသာဖြစ်သည်။"
        ]
      }
    ],
    examTips: [
      "`terraform validate` သည် Cloud Provider Credentials လိုသလား? 'No, it only checks syntax and internal consistency without connecting to remote APIs'။",
      "`terraform plan` က remote API ကို query လုပ်သလား? 'Yes, it refreshes the state against remote APIs'။",
      "Apply လုပ်နေတုန်း error တက်ရင် အစကပြန် rollback ဖြစ်သလား? 'No, successfully created resources remain in state'။",
      "`terraform fmt -check` သည် code ကို format မပြောင်းဘဲ format ကျ မကျ စစ်ဆေးရုံသာ စစ်ဆေးပေးသည် (CI/CD pipeline အတွက် သုံးသည်)။"
    ]
  },
  {
    id: 4,
    title: "Terraform Configuration",
    shortTitle: "Configuration",
    titleMy: "Objective 4: Terraform Configuration (Variables, Outputs, Locals, Lifecycles)",
    summaryMy: "Resources vs Data sources, Variables, Outputs, Locals, Expressions, count vs for_each, depends_on, Lifecycle rules, Pre/Postconditions, Sensitive values နှင့် Built-in Functions။",
    questionCount: 75,
    sections: [
      {
        heading: "၁။ Resources vs Data Sources",
        explanation: "Terraform တွင် Infrastructure ကို အဓိက ကိုင်တွယ်သော Block ၂ ခုမှာ `resource` နှင့် `data` ဖြစ်သည်။",
        keyPoints: [
          "`resource`: Infrastructure အသစ်များကို Create, Update, Destroy စီမံခန့်ခွဲရန် သုံးသည်။",
          "`data` (Data Source): Terraform ပြင်ပတွင် ရှိနှင့်ပြီးသား (သို့မဟုတ် အခြား system က ဆောက်ထားသော) Infrastructure များကို Read-only query လုပ်ပြီး သတင်းအချက်အလက် ယူရန် သုံးသည်။ (ဥပမာ- AWS ရဲ့ default VPC ID ကို ရှာယူခြင်း)"
        ],
        codeSnippet: `# Data Source: ရှိပြီးသား အချက်အလက်ကို Query လုပ်ခြင်း
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]
}

# Resource: အသစ်ဆောက်ခြင်း
resource "aws_instance" "app" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
}`
      },
      {
        heading: "၂။ Variables, Locals နှင့် Outputs",
        explanation: "Configuration ကို Dynamic ဖြစ်စေရန် သုံးသော တန်ဖိုးများ။",
        keyPoints: [
          "Input Variables (`variable`): ပြင်ပမှ ပေးပို့သော parameters များ။ `type`, `default`, `description`, `sensitive = true` သတ်မှတ်နိုင်သည်။",
          "Locals (`locals`): Module အတွင်း ထပ်ခါထပ်ခါ သုံးမည့် ရှုပ်ထွေးသော Expression များကို အမည်တစ်ခု ပေးထားခြင်း (Cannot be overridden from outside)။",
          "Outputs (`output`): တန်ဖိုးများကို CLI တွင် ထုတ်ပြရန် သို့မဟုတ် Child module မှ Parent module သို့ တန်ဖိုး return ပြန်ရန် သုံးသည်။"
        ]
      },
      {
        heading: "၃။ Variable Precedence (တန်ဖိုး ဦးစားပေး အဆင့်ဆင့်)",
        explanation: "Variable တန်ဖိုးကို နေရာအသီးသီးက ပေးထားပါက Terraform က အောက်ပါအတိုင်း အဆင့်အလိုက် ဦးစားပေးသည် (အမြင့်ဆုံးမှ အနိမ့်ဆုံးသို့):",
        keyPoints: [
          "1. CLI `-var` သို့မဟုတ် `-var-file` flags (အမြင့်ဆုံး)",
          "2. `*.auto.tfvars` သို့မဟုတ် `*.auto.tfvars.json` ဖိုင်များ",
          "3. `terraform.tfvars.json` ဖိုင်",
          "4. `terraform.tfvars` ဖိုင်",
          "5. Environment variables: `TF_VAR_<variable_name>`",
          "6. `variable` block ထဲရှိ `default` value (အနိမ့်ဆုံး)"
        ]
      },
      {
        heading: "၄။ count vs for_each ကွာခြားချက်",
        explanation: "Resource များကို အများအပြား ဆောက်လိုသည့်အခါ `count` သို့မဟုတ် `for_each` ကို သုံးသည်။",
        keyPoints: [
          "`count`: Integer အရေအတွက် (ဥပမာ- `count = 3`) သုံးသည်။ Resources များကို List Index (`[0]`, `[1]`, `[2]`) ဖြင့် မှတ်သားသည်။ အလယ်က index [1] ကို ဖျက်လိုက်ပါက [2] သည် [1] ဖြစ်သွားပြီး မလိုလားအပ်ဘဲ Recreate ဖြစ်တတ်သည်။",
          "`for_each`: Map သို့မဟုတ် Set of Strings ဖြင့် အလုပ်လုပ်သည်။ Resource များကို Key နာမည် (`[\"web\"]`, `[\"db\"]`) ဖြင့် မှတ်သားသဖြင့် တစ်ခုခုဖျက်သော်လည်း ကျန် resource များကို မထိခိုက်ပါ (Best practice)။",
          "`for_each` ကို list ဖြင့် သုံးလိုပါက `toset([\"a\", \"b\"])` ဖြင့် set ပြောင်းပေးရသည်။"
        ]
      },
      {
        heading: "၅။ Resource Lifecycle Rules",
        explanation: "Terraform ၏ ပုံမှန် resource အပြုအမူကို ပြောင်းလဲလိုပါက `lifecycle` block ကို သုံးသည်။",
        keyPoints: [
          "`create_before_destroy = true`: ပုံမှန်အားဖြင့် အဟောင်းဖျက်ပြီးမှ အသစ်ဆောက်သည်။ Zero-downtime လိုအပ်ပါက အသစ်အရင်ဆောက်ပြီးမှ အဟောင်းကို ဖျက်စေသည်။",
          "`prevent_destroy = true`: Production Database ကဲ့သို့ အရေးကြီး resource များကို မတော်တဆ `terraform destroy` လုပ်မိခြင်းမှ ကာကွယ်ပေးသည်။",
          "`ignore_changes = [tags, ami]`: Cloud Console ကနေ ပြင်ထားသော အချို့ attribute များကို Terraform က overwrite မလုပ်စေရန် လျစ်လျူရှုစေသည်။"
        ]
      },
      {
        heading: "၆။ Sensitive Values",
        explanation: "လျှို့ဝှက် passwords သို့မဟုတ် API keys များ မပေါက်ကြားစေရန်။",
        keyPoints: [
          "`sensitive = true` သတ်မှတ်ထားသော variable သို့မဟုတ် output သည် `terraform plan` နှင့် `terraform apply` CLI output တွင် `(sensitive value)` ဟုသာ ပေါ်ပြီး တန်ဖိုးကို ဝှက်ထားပေးသည်။",
          "အရေးကြီးသည့် အချက် (Exam Trap): Sensitive သတ်မှတ်ထားသော်လည်း `terraform.tfstate` ဖိုင်ထဲတွင် Plaintext အနေဖြင့် ရှိနေဆဲ ဖြစ်သည်။ ထို့ကြောင့် State file ကို သေချာ encrypt လုပ်ပြီး access control ကန့်သတ်ရမည်။"
        ]
      }
    ],
    examTips: [
      "`sensitive = true` ထားရင် state file ထဲမှာ encrypt ဖြစ်သွားသလား? 'No, sensitive values are stored in PLAINTEXT in the state file'။",
      "Variable precedence တွင် အမြင့်ဆုံးသည် ဘာလဲ? 'CLI flags (-var / -var-file)'။",
      "ရှိပြီးသား AWS resource ကို query လုပ်ပြီး ID ယူချင်ရင် ဘာသုံးမလဲ? 'data source'။",
      "Terraform တွင် custom functions ရေးလို့ရသလား? 'No, Terraform only supports built-in functions'။"
    ]
  },
  {
    id: 5,
    title: "Terraform Modules",
    shortTitle: "Modules",
    titleMy: "Objective 5: Terraform Modules နှင့် Code ပြန်လည်အသုံးပြုခြင်း",
    summaryMy: "Root module vs Child modules, Module Inputs/Outputs, Sources (Local, Registry, Git), Version constraints နှင့် Provider inheritance။",
    questionCount: 37,
    sections: [
      {
        heading: "၁။ Root Module နှင့် Child Module",
        explanation: "Terraform configuration files (`.tf`) ရှိသော directory တိုင်းသည် Module တစ်ခုဖြစ်သည်။",
        keyPoints: [
          "Root Module: `terraform apply` run သော လက်ရှိ main working directory ဖြစ်သည်။",
          "Child Module: Root module ထဲကနေ `module \"name\" { ... }` block ဖြင့် ခေါ်ယူသုံးစွဲသော အခြား module ဖြစ်သည်။",
          "Module သုံးခြင်းဖြင့် Code Duplication ကို လျှော့ချနိုင်ပြီး Infrastructure ကို Package လုပ်ကာ Reusable ဖြစ်စေသည်။"
        ]
      },
      {
        heading: "၂။ Module Inputs နှင့် Outputs ချိတ်ဆက်ပုံ",
        explanation: "Module တစ်ခုနှင့်တစ်ခု Data ပေးပို့ပုံ။",
        keyPoints: [
          "Input: Child module ထဲရှိ `variable` များကို `module` block ထဲတွင် arguments အနေဖြင့် တန်ဖိုး ထည့်ပေးရသည်။",
          "Output: Child module က `output` ထုတ်ပေးထားသော တန်ဖိုးကို အပြင် Root module က `module.<MODULE_NAME>.<OUTPUT_NAME>` ပုံစံဖြင့် လှမ်းယူရသည်။",
          "Child module ထဲက variable သို့မဟုတ် local တန်ဖိုးများကို output မထုတ်ထားဘဲ အပြင်ကနေ တိုက်ရိုက် access လုပ်၍ မရပါ။"
        ],
        codeSnippet: `module "vpc" {
  source = "./modules/vpc"
  cidr   = "10.0.0.0/16" # Input variable
}

resource "aws_subnet" "app" {
  vpc_id = module.vpc.vpc_id # Module output ကို လှမ်းသုံးခြင်း
}`
      },
      {
        heading: "၃။ Module Sources အမျိုးမျိုး",
        explanation: "`source` argument တွင် Module ကို မည်သည့်နေရာမှ ရယူမည်ကို သတ်မှတ်သည်။",
        keyPoints: [
          "Local path: `source = \"./modules/vpc\"` သို့မဟုတ် `source = \"../shared/s3\"`။",
          "Terraform Registry: `source = \"terraform-aws-modules/vpc/aws\"`။",
          "Git Repository: `source = \"git::https://github.com/org/repo.git\"` သို့မဟုတ် Git branch/tag ညွှန်းရန် `?ref=v1.2.0` ကို သုံးသည်။",
          "S3 Bucket: `source = \"s3::https://s3-eu-west-1.amazonaws.com/mybucket/vpc.zip\"`။"
        ]
      },
      {
        heading: "၄။ Module Version Constraints",
        explanation: "Module ၏ version ကို သတ်မှတ်ခြင်း။",
        keyPoints: [
          "Terraform Registry သို့မဟုတ် Private Registry မှ ခေါ်သော modules များတွင် `version = \"~> 3.0\"` ဟု သတ်မှတ်နိုင်သည်။",
          "သတိပြုရန် (Exam Trap): 'Local Source Modules' တွင် `version` parameter သုံး၍ မရပါ (Local directory ဖြစ်သောကြောင့် versioning မရှိပါ)။"
        ]
      }
    ],
    examTips: [
      "Child module ထဲက resource attribute တစ်ခုကို Root module မှာ ဘယ်လို ယူမလဲ? 'module.<MODULE_NAME>.<OUTPUT_NAME>' (Child module တွင် output သတ်မှတ်ထားရမည်)။",
      "Local module (`source = \"./my-module\"`) တွင် `version` attribute ထည့်လို့ရသလား? 'No, version argument is not supported for local modules'။",
      "Module အသစ်ထည့်ပြီးတိုင်း ဘာ command အရင် run ရမလဲ? 'terraform init' (Module download လုပ်ရန်)။"
    ]
  },
  {
    id: 6,
    title: "Terraform State Management",
    shortTitle: "State Management",
    titleMy: "Objective 6: Terraform State စီမံခန့်ခွဲမှုနှင့် Remote Backends",
    summaryMy: "terraform.tfstate ဖိုင်၊ Local vs Remote State, Backends (S3, GCS, HCP Terraform), State Locking, Migration, Security, Drift Detection နှင့် terraform state commands များ။",
    questionCount: 41,
    sections: [
      {
        heading: "၁။ Terraform State ဆိုတာဘာလဲ? ဘာကြောင့်လိုသလဲ?",
        explanation: "Terraform သည် Cloud ပေါ်က တကယ့်လက်ရှိ Infrastructure နှင့် သင်ရေးထားသော HCL Code တို့ကို ချိတ်ဆက်မှတ်သားရန် `terraform.tfstate` (JSON format) ဖိုင်ကို အသုံးပြုသည်။",
        keyPoints: [
          "Resource Mapping: Code ထဲရှိ `aws_instance.web` သည် Cloud ပေါ်က မည်သည့် instance ID `i-0123456789` ဖြစ်သည်ကို မှတ်ထားပေးသည်။",
          "Metadata & Dependencies: Resource များ၏ dependency အစီအစဉ်များကို ခြေရာခံသည်။",
          "Performance: `terraform plan` လုပ်တိုင်း Cloud API အားလုံးကို အချိန်ကုန်ခံ query မလုပ်ရဘဲ cache အနေဖြင့် စစ်ဆေးနိုင်သည်။"
        ]
      },
      {
        heading: "၂။ Remote Backends နှင့် State Locking",
        explanation: "Team ဖြင့် အလုပ်လုပ်သည့်အခါ Local disk တွင် state သိမ်းပါက sync မဖြစ်နိုင်သဖြင့် Remote Backend ကို သုံးရသည်။",
        keyPoints: [
          "Remote Backends: Amazon S3, Google Cloud Storage, Azure Blob, HCP Terraform (Terraform Cloud) စသည်တို့ ဖြစ်သည်။",
          "State Locking: အသင်းသား ၂ ယောက် တပြိုင်နက်တည်း `terraform apply` လုပ်မိပါက State file ပျက်စီး (corrupt) သွားနိုင်သဖြင့် apply လုပ်နေစဉ် Lock ချထားပေးသည်။",
          "AWS S3 backend တွင် State Locking အတွက် `dynamodb_table` (သို့မဟုတ် S3 native conditional writes) ကို အသုံးပြုသည်။",
          "အကယ်၍ Apply လုပ်နေစဉ် Process ပြတ်ကျပြီး Lock မပြေတော့ပါက `terraform force-unlock <LOCK-ID>` ဖြင့် ဖြေရှင်းနိုင်သည်။"
        ],
        codeSnippet: `terraform {
  backend "s3" {
    bucket         = "my-terraform-state-bucket"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks" # State locking
    encrypt        = true
  }
}`
      },
      {
        heading: "၃။ State Security",
        explanation: "State file သည် လုံခြုံရေးအရ အလွန်အရေးကြီးသည်။",
        keyPoints: [
          "Passwords, Database credentials, Private Keys များသည် State file ထဲတွင် Plaintext အနေဖြင့် သိမ်းဆည်းခံရသည်။",
          "ထို့ကြောင့် `terraform.tfstate` ကို Git (GitHub, GitLab) ထဲ လုံးဝ (လုံးဝ) Commit မလုပ်ရပါ (`.gitignore` တွင် ထည့်ထားရမည်)။",
          "Remote backend သုံးပါက Encryption-at-Rest (S3 KMS) နှင့် Encryption-in-Transit (TLS) တို့ကို မဖြစ်မနေ ဖွင့်ထားရမည်။"
        ]
      },
      {
        heading: "၄။ State Drift နှင့် Refresh",
        explanation: "တစ်စုံတစ်ယောက်က Cloud Console ကနေ Server ကို သွားဖျက်လိုက်ပါက သို့မဟုတ် သွားပြင်လိုက်ပါက Code နှင့် မတူတော့သည့် အခြေအနေကို 'Drift' ဟု ခေါ်သည်။",
        keyPoints: [
          "`terraform plan` သို့မဟုတ် `terraform apply` run သည့်အခါ Terraform က remote cloud API ကို စစ်ဆေးပြီး state ကို refresh လုပ်ကာ drift ကို ဖော်ပြပေးသည်။",
          "`terraform refresh-only`: Infrastructure ကို ဘာမှ မပြင်ဆင်ဘဲ Cloud ပေါ်က လက်ရှိအခြေအနေအတိုင်း State file ကိုသာ သီးသန့် update လုပ်ချင်သည့်အခါ သုံးသည်။"
        ]
      },
      {
        heading: "၅။ terraform state CLI Subcommands",
        explanation: "State file ကို တိုက်ရိုက် Text editor ဖြင့် မပြင်ရပါ၊ `terraform state` command ဖြင့်သာ ပြင်ရသည်။",
        keyPoints: [
          "`terraform state list`: State ထဲရှိ resources စာရင်းအားလုံးကို ထုတ်ပြသည်။",
          "`terraform state show <resource>`: သတ်မှတ် resource ၏ attribute အသေးစိတ်ကို ကြည့်သည်။",
          "`terraform state mv <source> <dest>`: Resource ကို မဖျက်ဘဲ state ထဲတွင် အမည်ပြောင်းသည် (သို့မဟုတ် အခြား module သို့ ရွှေ့သည်)။",
          "`terraform state rm <resource>`: Cloud ပေါ်က resource ကို မဖျက်ဘဲ Terraform state ထဲကနေသာ ထုတ်ပစ်သည် (Terraform မှ စီမံခန့်ခွဲမှု ရပ်တန့်စေသည်)။",
          "`terraform state pull`: Remote state ကို terminal ပေါ်သို့ stdout အဖြစ် ထုတ်ဖတ်သည်။"
        ]
      }
    ],
    examTips: [
      "`terraform.tfstate` ကို Git ထဲ commit လုပ်သင့်သလား? 'No! Never commit state files to Git because they contain sensitive plaintext data'။",
      "S3 backend တွင် state locking ရရန် ဘာ database သုံးသလဲ? 'Amazon DynamoDB'။",
      "Cloud resource ကို မဖျက်ဘဲ Terraform ရဲ့ tracking ကနေပဲ ဖယ်ထုတ်ချင်ရင် ဘာ command သုံးမလဲ? 'terraform state rm'။",
      "Backend configuration ကို ပြောင်းပြီးပါက ဘာ command run ရမလဲ? 'terraform init -migrate-state'။"
    ]
  },
  {
    id: 7,
    title: "Maintain Infrastructure with Terraform",
    shortTitle: "Maintain Infrastructure",
    titleMy: "Objective 7: လက်ရှိ Infrastructure ကို ထိန်းသိမ်းခြင်း၊ Import လုပ်ခြင်းနှင့် Debugging",
    summaryMy: "terraform import, Import blocks (Terraform 1.5+), Existing infrastructure, terraform show, TF_LOG log levels, TF_LOG_PATH နှင့် Troubleshooting။",
    questionCount: 28,
    sections: [
      {
        heading: "၁။ Terraform Import လုပ်ခြင်း (၂ မျိုး)",
        explanation: "Terraform မသုံးမီကတည်းက Console ကနေ လက်ဖြင့် ဆောက်ထားနှင့်ပြီးသား Existing Infrastructure များကို Terraform လက်အောက်သို့ သွတ်သွင်းခြင်း။",
        keyPoints: [
          "နည်းလမ်း (၁) - CLI `terraform import` (Imperative): `terraform import aws_instance.web i-12345678` ဟု ရိုက်ရသည်။ State ထဲသို့သာ ထည့်ပေးပြီး `.tf` code ကို အလိုအလျောက် မရေးပေးပါ (Code ကို လက်ဖြင့် လိုက်ရေးရသည်)။",
          "နည်းလမ်း (၂) - Declarative `import` block (Terraform 1.5+ Best Practice): Configuration ထဲတွင် `import { to = ... id = ... }` ဟု ရေးနိုင်သည်။ `terraform plan -generate-config-out=generated.tf` ဖြင့် HCL Code ပါ အလိုအလျောက် ထုတ်ပေးနိုင်သည်။"
        ],
        codeSnippet: `# Terraform 1.5+ Declarative Import Block
import {
  to = aws_instance.web
  id = "i-0123456789abcdef0"
}`
      },
      {
        heading: "၂။ Terraform Logging (TF_LOG နှင့် TF_LOG_PATH)",
        explanation: "Terraform တွင် Error ရှာရန် (Troubleshoot) အတွက် Environment Variables ၂ ခုကို သုံးသည်။",
        keyPoints: [
          "`TF_LOG`: Log level ကို သတ်မှတ်သည်။ Levels များမှာ: `TRACE` > `DEBUG` > `INFO` > `WARN` > `ERROR` ဖြစ်သည်။",
          "`TRACE`: အသေးစိတ်ဆုံး (Most verbose) log level ဖြစ်ပြီး HTTP request/response headers များနှင့် internal logic အားလုံး ပါဝင်သည်။",
          "`JSON` format logging ကိုလည်း `TF_LOG=JSON` ဖြင့် ထုတ်နိုင်သည်။",
          "`TF_LOG_PATH`: Log များကို Terminal တွင် မပြဘဲ File ထဲသို့ သိမ်းဆည်းရန် ဖိုင်လမ်းကြောင်း သတ်မှတ်ပေးခြင်း (ဥပမာ- `export TF_LOG_PATH=\"./terraform.log\"`)။"
        ]
      },
      {
        heading: "၃။ terraform show Command",
        explanation: "State file သို့မဟုတ် Plan file ၏ အချက်အလက်များကို လူဖတ်ရလွယ်ကူသော format ဖြင့် ပြသပေးသည်။",
        keyPoints: [
          "`terraform show`: လက်ရှိ state ထဲက အချက်အလက်အားလုံးကို ရှင်းလင်းစွာ ပြသသည်။",
          "`terraform show tfplan`: သိမ်းထားသော plan file ၏ အချက်အလက်များကို ဖတ်ရှုပြသသည်။",
          "`terraform show -json`: Automation tools များ ဖတ်ရှုနိုင်ရန် JSON format ဖြင့် ထုတ်ပေးသည်။"
        ]
      }
    ],
    examTips: [
      "အသေးစိတ်ဆုံး (Most verbose) logging level သည် ဘာလဲ? 'TRACE'။",
      "Log များကို file ထဲ ရေးမှတ်ရန် ဘာ variable သုံးသလဲ? 'TF_LOG_PATH'။",
      "`terraform import` CLI command သည် HCL configuration code ကို အလိုအလျောက် ရေးပေးသလား? 'No, it only imports into the state file; you must write the matching HCL code manually'။ (Declarative `import` block with `-generate-config-out` မှသာ code ထုတ်ပေးနိုင်သည်)။"
    ]
  },
  {
    id: 8,
    title: "HCP Terraform",
    shortTitle: "HCP Terraform",
    titleMy: "Objective 8: HCP Terraform (Terraform Cloud) နှင့် အဖွဲ့အစည်းဆိုင်ရာ စီမံခန့်ခွဲမှု",
    summaryMy: "HCP Terraform, Workspaces vs CLI workspaces, VCS-driven workflow, Variable Sets, Sentinel & OPA (Policy as Code), Run Tasks, Private Registry နှင့် Agents။",
    questionCount: 36,
    sections: [
      {
        heading: "၁။ HCP Terraform (Terraform Cloud) ဆိုတာဘာလဲ?",
        explanation: "HCP Terraform (ယခင် Terraform Cloud) သည် Terraform ကို အဖွဲ့အစည်း (Team/Enterprise) အဆင့်တွင် ပူးပေါင်းလုပ်ဆောင်နိုင်ရန် HashiCorp မှ ပေးသော Managed Cloud Platform ဖြစ်သည်။",
        keyPoints: [
          "Remote State Management: State ဖိုင်များကို Cloud ပေါ်တွင် လုံခြုံစွာ encrypt လုပ်ပြီး lock ချကာ သိမ်းပေးသည်။",
          "Remote Operations: `terraform plan` နှင့် `terraform apply` များကို Local machine ပေါ်တွင် မ run ဘဲ HCP Terraform ၏ လုံခြုံသော Container/VM ပေါ်တွင် Run ပေးသည်။"
        ]
      },
      {
        heading: "၂။ Workspaces (HCP Terraform vs Terraform CLI)",
        explanation: "ဤအချက်သည် စာမေးပွဲတွင် အမေးအများဆုံး မေးခွန်းတစ်ခု ဖြစ်သည်။",
        keyPoints: [
          "CLI Workspace (Open Source): Directory တစ်ခုတည်းတွင် Local state file အခွဲများ (`terraform.tfstate.d/dev`, `prod`) အဖြစ်သာ ခွဲပေးသည်။",
          "HCP Terraform Workspace: သီးခြား Environment တစ်ခုစီအတွက် State file သာမက သီးသန့် Environment Variables, Terraform Variables, Access Controls (RBAC), Run History များကိုပါ သီးခြားစီ ခွဲခြားစီမံပေးသော Complete Environment ဖြစ်သည်။"
        ]
      },
      {
        heading: "၃။ Workflow ပုံစံ ၃ မျိုး",
        explanation: "HCP Terraform တွင် Runs ပြုလုပ်နိုင်သော နည်းလမ်း ၃ မျိုး:",
        keyPoints: [
          "1. VCS-driven workflow (အသုံးအများဆုံး): GitHub, GitLab, Bitbucket စသည့် Git repo တွင် Pull Request တင်ပါက အလိုအလျောက် Speculative Plan ထုတ်ပေးပြီး Merge လုပ်ပါက Apply လုပ်ပေးသည်။",
          "2. CLI-driven workflow: Local terminal ကနေ `terraform plan` ရိုက်သော်လည်း အလုပ်လုပ်ခြင်းမှာ HCP Terraform Cloud ပေါ်တွင် သွားရောက် run သည်။",
          "3. API-driven workflow: CI/CD Pipeline သို့မဟုတ် Script များကနေ REST API ဖြင့် လှမ်း trigger ခေါ်ယူသည်။"
        ]
      },
      {
        heading: "၄။ Policy as Code (Sentinel နှင့် OPA)",
        explanation: "Infrastructure ကို Apply မလုပ်မီ ကုမ္ပဏီ၏ လုံခြုံရေးနှင့် စည်းကမ်းချက်များကို အလိုအလျောက် စစ်ဆေးတားမြစ်သော စနစ်။",
        keyPoints: [
          "Sentinel: HashiCorp ၏ Proprietary Policy-as-Code framework ဖြစ်သည်။ စည်းကမ်းချက် ၃ မျိုး ရှိသည်:",
          "  - Advisory: သတိပေးရုံသာ ပြပြီး Run ကို မတားဆီးပါ။",
          "  - Soft-mandatory: စည်းကမ်းချိုးဖောက်ပါက ရပ်တန့်သော်လည်း Admin/Authorized user က Override (ကျော်ခွင့်) ပေးနိုင်သည်။",
          "  - Hard-mandatory: စည်းကမ်းချိုးဖောက်ပါက လုံးဝ Override လုပ်ခွင့်မရှိဘဲ Apply ကို ပယ်ချသည်။",
          "OPA (Open Policy Agent): Cloud-native open standard ဖြစ်ပြီး Rego language ဖြင့် ရေးသားသော policies များကိုလည်း ထောက်ပံ့သည်။"
        ]
      },
      {
        heading: "၅။ Variable Sets နှင့် HCP Terraform Agents",
        explanation: "အဖွဲ့အစည်းဆိုင်ရာ အဆင့်မြင့် လုပ်ဆောင်ချက်များ။",
        keyPoints: [
          "Variable Sets: AWS Access Key, Region ကဲ့သို့သော ဘုံတူညီသည့် Variables များကို Workspace တိုင်းတွင် လိုက်မထည့်ရဘဲ Workspaces အများအပြားကို တစ်စုတည်း share ပေးနိုင်သော အစုအဝေး ဖြစ်သည်။",
          "HCP Terraform Agents: အကယ်၍ သင်၏ Infrastructure သည် Public Internet မှ မရသော Private Data Center သို့မဟုတ် Private VPC အတွင်း၌ ရှိနေပါက ထို private network ထဲတွင် Agent သွင်းထားပြီး HCP Terraform နှင့် လုံခြုံစွာ ဆက်သွယ် deploy လုပ်နိုင်သည်။"
        ]
      }
    ],
    examTips: [
      "Sentinel တွင် Authorized user က ကျော်ခွင့် (override) ပေးနိုင်သော Enforcement level သည် ဘာလဲ? 'Soft-mandatory'။ လုံးဝ override မရသည်မှာ 'Hard-mandatory'။",
      "Git Pull Request တင်လိုက်တာနဲ့ HCP Terraform က အလိုအလျောက် ဘာ run ပေးသလဲ? 'Speculative Plan'။",
      "On-premises private network ထဲက resources တွေကို HCP Terraform ကနေ deploy လုပ်ဖို့ ဘာလိုသလဲ? 'HCP Terraform Agents'။",
      "Open Source CLI workspace နှင့် HCP Terraform workspace ကွာခြားချက်ကို မေးပါက: HCP Terraform workspace တွင် variables, credentials, access controls များနှင့် state များ အားလုံး သီးခြားစီ ပါဝင်သည်ဟု ဖြေပါ။"
    ]
  }
];
