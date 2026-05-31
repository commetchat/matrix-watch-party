git clone https://github.com/element-hq/element-call.git element-call
cd element-call
git checkout v0.20.0
pnpm install
pnpm build:sdk

cd ..
rm -r ./src/matrixrtc
cp -R ./element-call/dist/ ./src/matrixrtc
