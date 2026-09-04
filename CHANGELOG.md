# Changelog

## [1.0.1](https://github.com/ivbbest/ai-for-developers-project-386/compare/cal-com-v1.0.0...cal-com-v1.0.1) (2026-09-04)


### Bug Fixes

* 15s timeout on every API request ([0c02a63](https://github.com/ivbbest/ai-for-developers-project-386/commit/0c02a6398d92a10cece4be9c3971769e5b0b9599))
* add server_error to the client error union ([ec2b452](https://github.com/ivbbest/ai-for-developers-project-386/commit/ec2b452dc7f3c8338a21e8f2fc93d62b110701e6))
* distinguish expired slots on confirm; accessible form fields ([710a383](https://github.com/ivbbest/ai-for-developers-project-386/commit/710a3831fc8041c5de5a89ef009d01b024a0b5ff))
* first review round on the consolidated review PR ([ab77ffd](https://github.com/ivbbest/ai-for-developers-project-386/commit/ab77ffdf186742ca4323a827c68bedba8909fc58))
* reset slot-page state when the event type changes ([1ad1b3c](https://github.com/ivbbest/ai-for-developers-project-386/commit/1ad1b3cd40a6b96a420d4fb618e71663ff6eb4ef))
* second review round on the consolidated review PR ([f7c7dc8](https://github.com/ivbbest/ai-for-developers-project-386/commit/f7c7dc8dbf659d48f391f59748291efb15cbc092))
* stub error semantics aligned with the backend ([0815ada](https://github.com/ivbbest/ai-for-developers-project-386/commit/0815ada226a0c1e11203d3afa2dc53d3c77524a8))
* third review round on the consolidated review PR ([a5de0fb](https://github.com/ivbbest/ai-for-developers-project-386/commit/a5de0fb0a814e2b99ea9584cdebaa7f0ae36779d))

## 1.0.0 (2026-09-03)


### Features

* add server_error to the contract error codes ([43184be](https://github.com/ivbbest/ai-for-developers-project-386/commit/43184be5108886ad4706ac05118cdcb03397e84b))
* add TypeSpec domain models per the contract spec ([c6942de](https://github.com/ivbbest/ai-for-developers-project-386/commit/c6942de460c9de44ae36d34a5e47c5a9c88fd5ee))
* add TypeSpec routes for the five contract endpoints ([def5343](https://github.com/ivbbest/ai-for-developers-project-386/commit/def5343c19bb4511fb1bc57d502b5beac21e3121))
* align screens with the reference screenshots ([5a925b3](https://github.com/ivbbest/ai-for-developers-project-386/commit/5a925b3e8e674bdd722a45bbe8e893c84f801e5d))
* all seven screens against the contract stub ([204dd12](https://github.com/ivbbest/ai-for-developers-project-386/commit/204dd12af18c41172a949f6e3f7a8a8d21f8d0c9))
* backend skeleton with SQLite storage, idempotent seed and catalog route ([6745038](https://github.com/ivbbest/ai-for-developers-project-386/commit/6745038cdc84156174ff76f55db2b972f5b32130))
* declare 413 payload_too_large on both POST endpoints ([2cdd657](https://github.com/ivbbest/ai-for-developers-project-386/commit/2cdd657ce86f949d752b0c60811b67d5eeaf5ff6))
* enforce multipleOf and strict object schemas; harden smoke ([dba2c29](https://github.com/ivbbest/ai-for-developers-project-386/commit/dba2c29ec7487cdba6bc94c6093a8b3e1cad1a99))
* event-type creation, upcoming bookings and prism-proxy contract check ([de3282e](https://github.com/ivbbest/ai-for-developers-project-386/commit/de3282e6027042b155b02be3428f4ed07d0757c5))
* frontend skeleton — Vite+React+TS, Tailwind, shadcn/ui, router ([4151ac5](https://github.com/ivbbest/ai-for-developers-project-386/commit/4151ac534fe0d970413dad6129f1cac8dfe2fce7))
* generate openapi.yaml and add Prism smoke for the contract ([756a25e](https://github.com/ivbbest/ai-for-developers-project-386/commit/756a25e368a61fb8e50fe3d7efd97fd1f6a9114a))
* graceful shutdown and insert-count from the event-type repo ([0833e04](https://github.com/ivbbest/ai-for-developers-project-386/commit/0833e0416af70ae972941af768dd513ef167e391))
* in-memory contract stub with stateful booking flow ([653ef88](https://github.com/ivbbest/ai-for-developers-project-386/commit/653ef88596545dbf6800b1e6c9e06f54b4ec6118))
* POST /bookings and the slots route with the unified error layer ([35680b1](https://github.com/ivbbest/ai-for-developers-project-386/commit/35680b15a533da900a130ddedc1fc1046cd44e2f))
* single-port prod mode and dev pairing against the real backend ([7dbd219](https://github.com/ivbbest/ai-for-developers-project-386/commit/7dbd219318a37a6941c5b56bab41e3223ba9f658))
* slot grid service with window, past exclusion and booked status ([dcdc080](https://github.com/ivbbest/ai-for-developers-project-386/commit/dcdc0800fd0134a8c459eebc0167d858a703d627))
* typed fetch client and vite proxy to the contract stub ([76f001e](https://github.com/ivbbest/ai-for-developers-project-386/commit/76f001e0cb30f4e05a8f6324e9ea400a31117b39))


### Bug Fixes

* address contract workspaces by exact package name ([4c37837](https://github.com/ivbbest/ai-for-developers-project-386/commit/4c37837b3a2873d3d081d9703deda904a1cf0667))
* alive-check for the conflict-path refetch ([042d4fc](https://github.com/ivbbest/ai-for-developers-project-386/commit/042d4fcf93480170288361e7a067fb41cacf66e8))
* canonicalize timestamps in storage; guards and test gaps from review ([611244b](https://github.com/ivbbest/ai-for-developers-project-386/commit/611244b5cd9dba75b27cf9508aebb2a9357f68cc))
* confirm guards, MSK day label, slot request race, date restore ([7e20c7a](https://github.com/ivbbest/ai-for-developers-project-386/commit/7e20c7a990ef8fd9b96ff58c63fc5b4a5019af49))
* confirm-page gates and shared pieces from PR review ([3410e21](https://github.com/ivbbest/ai-for-developers-project-386/commit/3410e210b3a67e239da2e1e3293b35de9a7e05f6))
* consolidate smoke cleanup into a single trap ([decc317](https://github.com/ivbbest/ai-for-developers-project-386/commit/decc3172ac9e41712d3475f5381e0aa73c9f78ce))
* DB CHECK constraints, typed InvalidDateError, boundary tests ([8ebee40](https://github.com/ivbbest/ai-for-developers-project-386/commit/8ebee4014f00f11ce72516b128c3ff1c021062fd))
* fourth review round on the frontend PR ([aba1d09](https://github.com/ivbbest/ai-for-developers-project-386/commit/aba1d092e5d1d46a9f4bdcfd697a91ac79eb766c))
* guard the end param with Date.parse like start ([fd9627b](https://github.com/ivbbest/ai-for-developers-project-386/commit/fd9627bbda892101bdefc53ad3a2a1bf65762825))
* make smoke readiness recognize Prism, not just the port ([c95b5cd](https://github.com/ivbbest/ai-for-developers-project-386/commit/c95b5cd9e61aacb46b8bf3b229f945c1f3348da1))
* name the offending value when toIsoUtc gets a non-date ([80f2db8](https://github.com/ivbbest/ai-for-developers-project-386/commit/80f2db80fe46bac4036d9624b7a05d9e28cf4f63))
* review findings on the backend API branch ([3a63abd](https://github.com/ivbbest/ai-for-developers-project-386/commit/3a63abd91e2a3bc41c32a2d4964f8a286df96a74))
* shutdown double-fire guard and full E12 duration invariant ([1b8e039](https://github.com/ivbbest/ai-for-developers-project-386/commit/1b8e03906b0c12e765aca89418ffe266802ece8b))
* SPA fallback skips file-like paths; one MSK day-boundary helper ([542acf1](https://github.com/ivbbest/ai-for-developers-project-386/commit/542acf190b7a9feb7eed63ed900960364f339e75))
* stub enforces contract validations found in review ([6c61684](https://github.com/ivbbest/ai-for-developers-project-386/commit/6c61684480f67526f80e374ddc3816f1ac1e8b59))
* third review round on the frontend PR ([29b75f2](https://github.com/ivbbest/ai-for-developers-project-386/commit/29b75f2eb3a97932a663cfbb85de94423f42ee89))
* tolerate empty DATABASE_PATH from the dev wrapper ([6d36142](https://github.com/ivbbest/ai-for-developers-project-386/commit/6d361423953cb8bb205adc85ea0241d19e4f5a2a))
* unmount guards on catalog/admin fetches and id input cap ([a2d2bc3](https://github.com/ivbbest/ai-for-developers-project-386/commit/a2d2bc37dd11ecef47cf49e6e0a6be118c1d5cce))


### Performance Improvements

* fetch the day's bookings once when building the slot grid ([bb4aef1](https://github.com/ivbbest/ai-for-developers-project-386/commit/bb4aef1f3a98f14d997aa5edab448df268d1a905))
