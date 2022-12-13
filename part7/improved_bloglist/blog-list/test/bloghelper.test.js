const listHelper = require('../utils/list_helper')
const empty_list = []
const list_one_blog = [{
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
}]

const blogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})


describe('total likes', () => {

    test('given empty list then it has 0 likes', () => {
        const result = listHelper.totalLikes(empty_list);
        expect(result).toBe(0);
    })

    test('given list has one blog then the like count is the same as the blog\'s likes', () => {
        const result = listHelper.totalLikes(list_one_blog)
        expect(result).toBe(list_one_blog[0].likes)
    })

    test('given list with multiple blogs then likes count should be added up correctly', () => {
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(36)
    })
})


describe('find favourite blog', () => {
    test('given empty list then return empty object', () => {
        const result = listHelper.favouriteBlog(empty_list)
        expect(result).toEqual({})
    })

    test(('given list with 1 object then expect the only object in list to be returned'), () => {
        const result = listHelper.favouriteBlog(list_one_blog)
        expect(result).toEqual(list_one_blog[0])
    })

    test('given list with multiple objects with only one top blog then return top blog', () => {
        const result = listHelper.favouriteBlog(blogs)
        expect(result).toEqual(blogs[2])
    })

    test('given list with multiple objects with only multiple top blog then return any top blog', () => {
        const sameLikesBlog = [
            {
                _id: "5a422a851b54a676234d17f7",
                title: "React patterns",
                author: "Michael Chan",
                url: "https://reactpatterns.com/",
                likes: 7,
                __v: 0
            },
            {
                _id: "5a422aa71b54a676234d17f8",
                title: "Go To Statement Considered Harmful",
                author: "Edsger W. Dijkstra",
                url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
                likes: 7,
                __v: 0
            },
            {
                _id: "5a422b3a1b54a676234d17f9",
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
                likes: 1,
                __v: 0
            }
        ]
        const result = listHelper.favouriteBlog(sameLikesBlog)
        expect(result).toHaveProperty('likes', 7)
    })
})


describe('find author with most blog entries', () => {

    const sameLikesBlog = [
        {
            _id: "5a422ba71b54a676234d17fb",
            title: "TDD harms architecture",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
            likes: 0,
            __v: 0
        },
        {
            _id: "5a422bc61b54a676234d17fc",
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            likes: 2,
            __v: 0
        },
        {
            _id: "5a422aa71b54a676234d17f8",
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
            likes: 7,
            __v: 0
        },
        {
            _id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 1,
            __v: 0
        },
        {
            _id: "5a422a851b54a676234d17f7",
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
            __v: 0
        },
    ]


    test('given empty list then return empty object', () => {
        const result = listHelper.mostBlogs(empty_list)
        expect(result).toEqual({})
    })

    test('given list of 1 blog then return the only blog author and amount of blogs as 1', () => {
        const result = listHelper.mostBlogs(list_one_blog)
        expect(result).toEqual({ author: 'Michael Chan', blogs: 1 })
    })

    test('given list of blogs then return author with most entries', () => {
        const result = listHelper.mostBlogs(blogs)
        expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 })
    })


    test('given list of blogs which has 2 authors with the most blogs then return the earliest most blogged author in array', () => {
        const result = listHelper.mostBlogs(blogs)
        expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 })
    })
})

describe('find author with most likes over every blog', () => {
    const sameLikesBlog = [
        {
            _id: "5a422ba71b54a676234d17fb",
            title: "TDD harms architecture",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
            likes: 5,
            __v: 0
        },
        {
            _id: "5a422bc61b54a676234d17fc",
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            likes: 4,
            __v: 0
        },
        {
            _id: "5a422aa71b54a676234d17f8",
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
            likes: 3,
            __v: 0
        },
        {
            _id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 1,
            __v: 0
        },
        {
            _id: "5a422a851b54a676234d17f7",
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 8,
            __v: 0
        },
    ]
    test('given empty list then return empty object', () => {
        const result = listHelper.mostLikes(empty_list)
        expect(result).toEqual({})
    })

    test('given list of 1 blog then return the likes from the only blog', () => {
        const result = listHelper.mostLikes(list_one_blog)
        expect(result).toEqual({author: 'Michael Chan', likes: list_one_blog[0].likes})
    })

    test('given list of blogs then return the sum of likes from the author with most likes ', () => {
        const result = listHelper.mostLikes(blogs)
        expect(result).toEqual({author: 'Edsger W. Dijkstra', likes: 17})
    })

    test('given list where 2 authors have the same sum of likes return author earliest in the array', () => {
        const result = listHelper.mostLikes(sameLikesBlog)
        expect(result).toEqual({author: 'Robert C. Martin', likes: 9})
    })
})

