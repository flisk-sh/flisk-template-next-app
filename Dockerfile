# A real create-next-app project (App Router, TypeScript, no Tailwind): the scaffolder runs at build time.
FROM node:26-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5
WORKDIR /work
RUN npx --yes create-next-app@16.4.6 app --ts --app --no-tailwind --eslint --no-src-dir --import-alias "@/*" \
    --use-npm --yes --disable-git </dev/null
WORKDIR /work/app
RUN chown -R node:node .
USER node
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 CMD nc -z 127.0.0.1 ${PORT:-3000} || exit 1
# next dev must listen beyond loopback (-H) and on the port Flisk assigns.
CMD ["sh", "-c", "npx next dev -H 0.0.0.0 -p ${PORT:-3000}"]
