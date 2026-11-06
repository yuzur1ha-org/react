# Documentation rules

Only root README.md/README.zh-cn.md are bilingual and must stay aligned. Package/application READMEs are concise English; do not add translated package READMEs or package-local Chinese guides. Third-party notices and Changeset summaries use English; preserve the official CLI-generated Changesets README.

Public Markdown/Press guides live in apps/docs/src/content and use English. Chinese site pages contain brief translation-in-progress notices with links to the English guides. Internal review documents under docs/ remain Simplified Chinese; do not remove them as untranslated public content. Agent text and code comments remain English.

Document actual APIs, peer requirements and limitations. Validate links/examples and never claim publication without evidence. Keep plans in docs/plans, decisions in docs/architecture/adr, acceptance in docs/features and runbooks in docs/operations/runbooks.
