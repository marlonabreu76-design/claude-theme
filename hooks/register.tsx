import type { EngineInterface, Register } from 'claude-code'

import { COMPANIES, LOOKS, PROBLEMS, SCENES, type Company } from './looks'

const KEY = 'company'
const COMMANDS: Record<string, Company> = { craque: 'craque', pixel: 'pixel', sandpoint: 'sandpoint' }

function isCompany(value: unknown): value is Company {
  return value === 'craque' || value === 'pixel' || value === 'sandpoint'
}

async function apply($: EngineInterface, company: Company): Promise<string | undefined> {
  const unpainted = PROBLEMS[company].find(line => line.startsWith("Desktop won't paint"))
  if (unpainted !== undefined) $.ui.toast(unpainted)
  const look = LOOKS[company]
  try {
    const set = await $.theme.set(look)
    return set.isDrawn ? undefined : set.reason
  } catch (error) {
    $.ui.log(String(error))
    const { style: _style, ...plain } = look
    const set = await $.theme.set(plain)
    return set.isDrawn ? undefined : set.reason
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    for (const [name, company] of Object.entries(COMMANDS)) {
      await $.command.register({ name, description: `Switch Claude's look to ${COMPANIES[company].name}` })
    }
    const saved = await $.store.get(KEY)
    const reason = await apply($, isCompany(saved) ? saved : 'craque')
    if (reason !== undefined) $.ui.status(reason)
    return next(e)
  })

  for (const [name, company] of Object.entries(COMMANDS)) {
    on('command.run', { command: name }, async $ => {
      await $.store.set(KEY, company)
      const reason = await apply($, company)
      return { text: reason === undefined ? `Look switched to ${COMPANIES[company].name}.` : `Saved ${COMPANIES[company].name}, but nothing is drawn here: ${reason}` }
    })
  }

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') return next(e)
    const scene = e.props.scene
    if (!isCompany(scene)) return next(e)
    const { Svg } = $.ui.resolve(e)
    return <Svg source={SCENES[scene]} alt={COMPANIES[scene].alt} isInteractive />
  })
}
