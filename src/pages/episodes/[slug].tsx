import { GetStaticPaths, GetStaticProps } from 'next'

import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import api from '../../services/api'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

type Episode = {
    id: string,
    title: string,
    members: string,
    publishedAt: string,
    thumbnail: string,
    description: string,
    duration: number,
    durationAsString: string,
    url: string
}

type EpisodeProps = {
    episode: Episode
}

export default function Episode({ episode }: EpisodeProps) {

    return (
        <span>{JSON.stringify(episode)}</span>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {

    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { slug } = context.params

    const { data } = await api.get(`/episodes/${slug}`)

    const episode = {
        id: data.id,
        title: data.title,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        thumbnail: data.thumbnail,
        description: data.description,
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        url: data.file.url
    }

    return {
        props: {
            episode
        },
        revalidate: 60 * 60 * 24, //24 horas
    }
}