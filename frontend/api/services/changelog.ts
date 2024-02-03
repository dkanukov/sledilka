import { Api, EntityNewAnnouncement, HttpClient } from '../generated/api'

const api = new Api<HttpClient>()

export const createChangelog = async (newChangelog: EntityNewAnnouncement) => {
	const response = await api.announcement.announcementCreate(newChangelog)

	return response.status === 200
}

export const getChangelogList = async () => {
	const { data } = await api.announcement.announcementList()

	return data
}