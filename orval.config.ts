import { defineConfig } from 'orval'
import axios from 'axios'
import fs from 'fs'
import path from 'path'


const linksPath = path.resolve(process.cwd(), 'src/links/index.ts')
const linksContent = fs.readFileSync(linksPath, 'utf8')


const backendHostMatch = linksContent.match(/const\s+backendHost\s*=\s*['"`]([^'"`]+)['"`]/)
const backendHost = backendHostMatch ? backendHostMatch[1] : ''

const siteURLMatch = linksContent.match(/siteURL\s*:\s*['"`]([^'"`]+)['"`]/)
const siteURL = siteURLMatch ? siteURLMatch[1] : ''


const imageEndpointMatch = linksContent.match(/imageEndpoint\s*:\s*`([^`]*)`/)
let imageEndpoint = ''
if (imageEndpointMatch) {
  imageEndpoint = imageEndpointMatch[1].replace(/\${\s*backendHost\s*}/g, backendHost)
} else {
  const simpleMatch = linksContent.match(/imageEndpoint\s*:\s*['"`]([^'"`]+)['"`]/)
  imageEndpoint = simpleMatch ? simpleMatch[1] : ''
}

const orvalConfig = async () => {
  const { data: swagger } = await axios.get(`${imageEndpoint}/swagger/swagger-output.json`, {
    headers: { Origin: siteURL }
  })

  return defineConfig({
    'saigon-business': {
      output: {
        mode: 'tags',
        target: 'src/api/endpoints/index.ts',
        schemas: 'src/api/models',
        client: 'react-query',
        prettier: true,
        override: {
          query: {
            useQuery: true,
            useInfinite: true,
            usePrefetch: true
            // useSuspenseQuery: true
          },
          mutator: {
            path: './src/api/mutator/custom-client.ts',
            name: 'useCustomClient'
          }
        }
      },
      input: {
        target: swagger,
        filters: {
          tags: [
            'Auth',
            'WebsiteConfig',
            'Event',
            'Files',
            'Footer',
            'Order',
            'OrganizationCategory',
            'Organizations',
            'PageConfig',
            'Permisions',
            'Products',
            'Schedule',
            'Status',
            'Users',
            'Validator',
            'Contact',
            'Statistic',
            'Notification',
            'MembershipFee',
            'PermisionFunction',
            'Department',
            'UserDepartment',
            'UserHistory',
            'Approvals',
            'News',
            'Category',
            'NewsPageConfig',
          ]
        }
      }
    }
  })
}

export default orvalConfig
