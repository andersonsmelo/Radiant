import type { Href } from 'expo-router';
import type { JourneyNode, NextNodeDecision } from '../../../types/journey';

export function canOpenJourneyNode(node: JourneyNode): boolean {
  if (node.status === 'locked') {
    return false;
  }

  if ((node.type === 'lesson' || node.type === 'review') && node.blockId) {
    return true;
  }

  if (node.type === 'checkpoint') {
    return true;
  }

  if (node.type === 'reward') {
    return node.status === 'available' || node.status === 'active';
  }

  return false;
}

export function getJourneyNodeHref(node: JourneyNode): Href | null {
  if ((node.type === 'lesson' || node.type === 'review') && node.blockId) {
    return {
      pathname: '/learn',
      params: {
        nodeId: node.id,
        blockId: node.blockId,
      },
    } as Href;
  }

  if (node.type === 'checkpoint') {
    return {
      pathname: '/checkpoint',
      params: {
        nodeId: node.id,
      },
    } as Href;
  }

  if (node.type === 'reward') {
    return ({
      pathname: '/reward',
      params: {
        nodeId: node.id,
      },
    } as unknown) as Href;
  }

  return null;
}

export function getNextNodeHref(
  node: JourneyNode,
  decision: NextNodeDecision,
): Href | null {
  const href = getJourneyNodeHref(node);
  if (href === null || decision.reason !== 'paused-lesson' || decision.resumeStepIndex === undefined) {
    return href;
  }

  if (typeof href !== 'object' || href.pathname !== '/learn') return href;

  return {
    ...href,
    params: {
      ...href.params,
      resumeCursorId: `step-${decision.resumeStepIndex}`,
    },
  } as Href;
}
