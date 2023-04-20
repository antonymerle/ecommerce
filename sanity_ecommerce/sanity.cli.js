import {defineCliConfig} from 'sanity/cli'
import {getStudioEnvironmentVariables} from 'sanity/cli'

getStudioEnvironmentVariables({
  envFile: {
    mode: 'production',
    envDir: '.',
    prefix: 'process.env.',
  },
})

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
  },
})
