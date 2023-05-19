# Development

## Useful git commands

### Tagging

```bash
git tag -f -a r1.0.0 -m "release 1.0.0"
git push -f --tags
```

### Cleanup local repository

```bash
git fetch -p
git branch --merged | egrep -v "(^\*|main)" | xargs git branch -d
```

### Reveal all commits and stashes (even deleted ones)

```bash
gitk --all $(git fsck --no-reflogs | awk '/dangling commit/ {print $3}')
```

### Get everything from stash

```bash
git checkout stash -- .
```
