# create-next-app

**Stack:** a real `create-next-app` project (App Router, TypeScript, ESLint, no Tailwind, no `src/`)

**Notes:** scaffolder runs at build time; `next dev -H 0.0.0.0 -p $PORT`. Next.js owns its server, so this is bring-your-own, not a Flisk frontend provider.

Flisk bring-your-own template. The container contract is in [docs/byo.md](https://github.com/flisk-sh/flisk/blob/main/docs/byo.md).

## Check it

Needs Docker. CI runs the same check on every pull request (`.github/workflows/verify.yml`): build, run with `PORT=4000`, expect HTTP 200 on `/`.

```bash
docker build -t template . && docker run --rm -e PORT=4000 -p 4000:4000 template
```

## Use it in a Flisk project

This repo already includes a [`service.json`](service.json) that registers the resource as `next-web`, so Flisk picks it up automatically when this folder is inside a Flisk project.

```bash
# from the folder that contains this template
flisk up
```

To add a second copy of this template in the same Flisk project, register it under a different resource name:

```bash
flisk resource next-web-copy --type bring-your-own --stack shop --dockerfile ./Dockerfile --health-path / --yes
```

Use a resource name that is unique across Flisk projects sharing one Docker daemon.

After `flisk up`, open the URL printed by `flisk status` (for a web UI like this template it is the host-root URL, not `/api/next-web`).
