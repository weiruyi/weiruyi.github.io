set -e
pnpm run docs:build   
git add -A
git commit -m 'deploy'
git push

