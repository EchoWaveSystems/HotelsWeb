import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GraphQLService {
  private readonly apiUrl = 'http://localhost:5100/graphql';

  constructor(private http: HttpClient) {}

  query<T>(query: string, variables: any = {}): Observable<T> {
    return this.http.post<any>(this.apiUrl, { query, variables }).pipe(
      map(response => {
        if (response.errors) {
          throw new Error(response.errors.map((e: any) => e.message).join(', '));
        }
        return response.data;
      })
    );
  }

  mutate<T>(mutation: string, variables: any = {}): Observable<T> {
    return this.query<T>(mutation, variables);
  }

  getHotels(take: number, skip: number, city?: string, sortBy?: string, sortOrder?: string): Observable<any> {
    let queryArgs = '$take: Int!, $skip: Int!';
    let hotelsArgs = 'take: $take, skip: $skip';

    if (city) {
      queryArgs += ', $where: HotelFilterInput';
      hotelsArgs += ', where: $where';
    }

    if (sortBy && sortOrder) {
      queryArgs += ', $order: [HotelSortInput!]';
      hotelsArgs += ', order: $order';
    }

    const query = `
      query GetHotels(${queryArgs}) {
        hotels(${hotelsArgs}) {
          items {
            uniqId
            name
            city
            address
            averageRating
            reviewCount
            photoCount
            amenities
            hotelStarRating
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          totalCount
        }
      }
    `;

    const variables: any = { take, skip };
    if (city) {
      variables.where = { city: { eq: city } };
    }
    if (sortBy && sortOrder) {
      variables.order = [{ [sortBy]: sortOrder }];
    }

    return this.query<any>(query, variables).pipe(map(data => data?.hotels));
  }

  getHotel(uniqId: string): Observable<any> {
    const query = `
      query GetHotel($uniqId: String!) {
        hotel(uniqId: $uniqId) {
          uniqId
          name
          crawlTimestamp
          pageUrl
          hotelId
          area
          city
          address
          lat
          long
          amenities
          hotelStarRating
          hotelType
          reviewCount
          averageRating
          photoCount
          cleanliness
          facilities
          location
          staff
          wifi
          comfort
          valueForMoney
        }
      }
    `;
    return this.query<any>(query, { uniqId }).pipe(map(data => data.hotel));
  }

  createHotel(input: any): Observable<any> {
    const mutation = `
      mutation CreateHotel($input: CreateHotelInput!) {
        createHotel(input: $input) {
          uniqId
          status
          message
        }
      }
    `;
    return this.mutate<any>(mutation, { input }).pipe(map(data => data.createHotel));
  }
}
