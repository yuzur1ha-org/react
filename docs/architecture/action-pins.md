# Actions 固定版本

2026-11-04 从各官方仓库通过 `git ls-remote` 核实 tag 指向；Changesets 使用解引用后的提交，并读取该提交的 action.yml 核对 v2 输入名。工作流不会复用其他仓库凭据。

| Action | 核实版本 | 提交 |
| --- | --- | --- |
| actions/checkout | v5 | fbc6f3992d24b796d5a048ff273f7fcc4a7b6c09 |
| actions/setup-node | v5 | a0853c24544627f65ddf259abe73b1d18a591444 |
| pnpm/action-setup | v4 | f40ffcd9367d9f12939873eb1018b921a783ffaa |
| actions/upload-artifact | v7.0.2 | cf430e030ddbb5b0abf93d22962f4752f3646cd9 |
| actions/upload-pages-artifact | v5.0.0 | fc324d3547104276b827a68afc52ff2a11cc49c9 |
| actions/configure-pages | v6.0.0 | 45bfe0192ca1faeb007ade9deae92b16b8254a0d |
| actions/deploy-pages | v5.0.1 | 368f82528645a54fb793d4d04e342629a3f51346 |
| actions/create-github-app-token | v3.3.0 | 64ab729a6294000f5aa4a4bc0b73d1f32bc45510 |
| changesets/action | v2.1.2 | ae32849d5ba541f9ae29e40e22a623bc13562f51 |

SHA 核实不等于工作流已经在 GitHub 执行；实际 CI、Windows runner、npm OIDC 与 Pages environment 仍需远端验收。升级时核实新 tag、运行时要求与输入接口，并保留精确提交。
