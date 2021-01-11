
describe('Search shows', function() {
    it('should get 2 results from search in searchShows(\'bletchley\')', async function() {
        let shows = await searchShows('bletchley');
        expect(shows.length).toEqual(2);
    })
})