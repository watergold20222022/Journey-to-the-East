# OpenCode Configuration and Status

## Document Information

- **Last Updated**: 2026-02-06
- **Project**: Journey to the East
- **Purpose**: OpenCode setup, configuration, and maintenance guide

## Current Version Status

### OpenCode CLI

- **Version**: `1.1.53`
- **Status**: ✅ Latest version (confirmed)
- **Installation Location**: `/home/localtest/.nvm/versions/node/v22.12.0/bin/opencode`
- **Installation Method**: npm
- **Last Checked**: 2026-02-06

### OpenCode Plugin

- **Version**: `^1.1.53`
- **Status**: ✅ Latest version
- **Location**: `.opencode/node_modules/@opencode-ai/plugin`
- **Last Updated**: 2026-02-06

### Version Consistency

| Component | Version | Status |
|-----------|---------|--------|
| OpenCode CLI | 1.1.53 | ✅ Latest |
| OpenCode Plugin | 1.1.53 | ✅ Latest |
| **Sync Status** | **Match** | ✅ **Perfect Sync** |

## Installation Details

### System Environment

```
Node.js: v22.12.0
Package Manager: npm (via nvm)
Platform: Linux
Security Status: No vulnerabilities found
```

### Directory Structure

```
Journey-to-the-East/
├── .opencode/
│   ├── package.json          # Plugin dependencies
│   ├── bun.lock              # Lock file
│   ├── node_modules/
│   │   ├── @opencode-ai/plugin@1.1.53
│   │   ├── @opencode-ai/sdk
│   │   └── zod
│   └── skills/
│       └── pptx/             # PowerPoint skill package
│           ├── SKILL.md
│           ├── ooxml.md
│           ├── html2pptx.md
│           └── LICENSE.txt
└── .gitignore                # .opencode/ is ignored
```

### Installed Skills

#### PowerPoint Skill (`pptx`)
- **Location**: `.opencode/skills/pptx/`
- **Purpose**: Presentation creation, editing, and analysis
- **Capabilities**:
  - Create new presentations
  - Modify existing content
  - Work with layouts
  - Add comments and speaker notes
  - Handle OOXML format

## Available Commands

### Core Commands

```bash
# Start OpenCode TUI
opencode [project]

# Start web interface
opencode web

# Run with a message
opencode run [message..]

# Attach to running server
opencode attach <url>

# Start headless server
opencode serve
```

### Management Commands

```bash
# Upgrade to latest version
opencode upgrade [target]

# Manage credentials
opencode auth

# Manage agents
opencode agent

# Manage MCP servers
opencode mcp

# Manage GitHub agent
opencode github

# Manage sessions
opencode session
```

### Utility Commands

```bash
# Show usage statistics
opencode stats

# Export session data
opencode export [sessionID]

# Import session data
opencode import <file>

# List available models
opencode models [provider]

# Debugging tools
opencode debug

# Generate shell completion
opencode completion

# Uninstall OpenCode
opencode uninstall
```

### Advanced Options

```bash
# Specify model
opencode -m, --model <provider/model>

# Continue last session
opencode -c, --continue

# Continue specific session
opencode -s, --session <session-id>

# Use specific prompt
opencode --prompt <prompt>

# Use specific agent
opencode --agent <agent>

# Network options
opencode --port <number>           # Default: 0 (auto)
opencode --hostname <hostname>     # Default: 127.0.0.1
opencode --mdns                    # Enable mDNS service discovery
opencode --mdns-domain <domain>    # Default: opencode.local
opencode --cors <domains>          # Additional CORS domains

# Logging options
opencode --print-logs              # Print logs to stderr
opencode --log-level <level>       # DEBUG, INFO, WARN, ERROR
```

## Configuration Files

### `.opencode/package.json`

```json
{
  "dependencies": {
    "@opencode-ai/plugin": "^1.1.53"
  }
}
```

### `.gitignore` Entry

```
# OpenCode skills
.opencode/
```

**Reason**: The `.opencode/` directory contains node_modules and user-specific configurations that should not be committed to version control.

## Maintenance Guide

### Checking for Updates

```bash
# Check current version
opencode --version

# Check for updates and upgrade
opencode upgrade

# Upgrade using specific method
opencode upgrade --method npm
# Methods: curl, npm, pnpm, bun, brew, choco, scoop
```

### Updating Plugin

```bash
cd .opencode
npm install @opencode-ai/plugin@latest
```

### Verifying Installation

```bash
# Check CLI version
opencode --version

# Check plugin version
cd .opencode && npm list @opencode-ai/plugin

# Verify both are in sync
echo "CLI: $(opencode --version)"
cat .opencode/package.json | grep '@opencode-ai/plugin'
```

### Troubleshooting

```bash
# Run debug tools
opencode debug

# Check logs (with verbose output)
opencode --print-logs --log-level DEBUG

# Reinstall plugin
cd .opencode
rm -rf node_modules
npm install
```

## Integration with Project

### Project Documentation

OpenCode has access to the following project documentation:

1. **AGENTS.md** - Guidelines for agentic coding assistants
   - Build/lint/test commands
   - Code style guidelines
   - Project overview
   - Best practices

2. **FEEDBACK_FEATURE.md** - Reader feedback feature documentation
   - API endpoints
   - Data structure
   - Implementation details
   - Testing results

3. **CHAPTER_SUMMARIES.md** - Narrative reference
   - Chapter summaries
   - Story continuity
   - Character development

4. **README.md** - Project overview
   - Setup instructions
   - Project structure
   - Development guidelines

### Workflow Integration

OpenCode is configured to work seamlessly with:
- Next.js 14 development workflow
- Git version control
- ESLint code quality checks
- npm package management
- Chapter content management

### AI Agent Context

When OpenCode agents work in this repository, they have access to:
- Full codebase context
- Project documentation (AGENTS.md)
- Code style guidelines
- Testing procedures
- Build commands

## Features and Capabilities

### Supported Tasks

✅ **Code Development**
- Write and modify code
- Follow project style guidelines
- Run build and lint commands
- Create and update documentation

✅ **Git Operations**
- Create commits
- Manage branches
- Review changes
- Push to remote

✅ **API Development**
- Create API endpoints
- Test API routes
- Implement error handling
- Document APIs

✅ **Documentation**
- Generate markdown files
- Update existing docs
- Create technical specifications
- Write usage guides

✅ **Testing**
- Manual testing workflows
- API endpoint testing
- Browser testing guidance
- Error validation

### Special Skills

**PowerPoint Integration** (via pptx skill)
- Create presentations from markdown
- Generate slide decks
- Modify existing presentations
- Export to PPTX format

## Security and Privacy

### Credential Management

```bash
# Manage authentication
opencode auth

# Credentials are stored securely
# Location: System-specific secure storage
```

### Data Privacy

- Session data stored locally
- No automatic telemetry
- Export/import for backup
- Full control over data

### Rate Limiting

- Respects API rate limits
- Token usage tracking
- Cost monitoring via `opencode stats`

## Usage Statistics

### Tracking Usage

```bash
# View token usage and costs
opencode stats

# Export session for analysis
opencode export [sessionID]
```

### Session Management

```bash
# List sessions
opencode session

# Continue last session
opencode -c

# Continue specific session
opencode -s <session-id>

# Import previous session
opencode import <file>
```

## Best Practices

### 1. Regular Updates

```bash
# Check weekly for updates
opencode upgrade
```

### 2. Session Management

- Use meaningful session names
- Export important sessions for backup
- Clean up old sessions periodically

### 3. Documentation

- Keep AGENTS.md updated with project changes
- Document new features immediately
- Use OpenCode to generate documentation

### 4. Version Control

- Never commit `.opencode/` directory
- Keep plugin version in sync with CLI
- Document OpenCode usage in commit messages

### 5. Performance

- Use `--print-logs` for debugging only
- Close unused sessions
- Monitor token usage with `opencode stats`

## Upgrade History

| Date | Previous Version | New Version | Notes |
|------|-----------------|-------------|-------|
| 2026-02-06 | 1.1.51 | 1.1.53 | Plugin and CLI updated to latest |

## Common Issues and Solutions

### Issue: Version Mismatch

**Problem**: CLI and plugin versions don't match

**Solution**:
```bash
# Update CLI
opencode upgrade

# Update plugin
cd .opencode && npm install @opencode-ai/plugin@latest
```

### Issue: Command Not Found

**Problem**: `opencode` command not recognized

**Solution**:
```bash
# Check installation
which opencode

# If not found, reinstall
npm install -g opencode
```

### Issue: Permission Errors

**Problem**: Cannot write to `.opencode/` directory

**Solution**:
```bash
# Fix permissions
chmod -R u+w .opencode/

# Or remove and reinstall
rm -rf .opencode/
mkdir .opencode
cd .opencode && npm init -y && npm install @opencode-ai/plugin
```

### Issue: Outdated Dependencies

**Problem**: Security warnings or outdated packages

**Solution**:
```bash
cd .opencode
npm audit fix
npm update
```

## Future Enhancements

### Planned Updates

- [ ] Additional skill packages for specific tasks
- [ ] Custom agent configurations
- [ ] Project-specific prompts
- [ ] Enhanced MCP integrations

### Monitoring

- Check for OpenCode updates monthly
- Review new features in release notes
- Update documentation as features evolve

## Support and Resources

### Official Resources

- **GitHub**: https://github.com/anomalyco/opencode
- **Documentation**: https://opencode.ai/docs
- **Feedback**: Report issues at GitHub repository

### Getting Help

```bash
# View help for any command
opencode <command> --help

# Access debugging tools
opencode debug

# Check documentation
# Visit https://opencode.ai/docs
```

## Project-Specific Notes

### Journey to the East Integration

This project uses OpenCode for:
- Adding new chapters and content
- Implementing features (e.g., reader feedback system)
- Updating documentation
- Managing code style consistency
- Git workflow automation

### Custom Workflows

**Adding New Chapters**:
1. Use OpenCode to generate chapter content
2. Follow CHAPTER_SUMMARIES.md narrative
3. Update chapter index automatically
4. Commit with proper message format

**Feature Development**:
1. Plan with OpenCode assistance
2. Implement following AGENTS.md guidelines
3. Test using documented procedures
4. Document in feature-specific MD files

**Documentation Updates**:
1. Keep AGENTS.md current with changes
2. Create feature documentation (e.g., FEEDBACK_FEATURE.md)
3. Update README.md as needed
4. Maintain CHAPTER_SUMMARIES.md

## Conclusion

OpenCode is fully configured and up-to-date for the Journey to the East project. All components are at version 1.1.53, documentation is current, and the system is ready for development work.

For any questions or issues, refer to this document or run `opencode --help` for command-specific guidance.

---

**Last verified**: 2026-02-06  
**Next review**: 2026-03-06 (monthly)  
**Maintained by**: OpenCode AI Agents
