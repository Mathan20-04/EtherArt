import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { ApiService } from "./api.service";
import { DataService } from "./data.service";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CollectionService extends BaseService {
  private urlGetCollection = "main/collection/get-list-object-page";
  private urlGetItemInCollection = "main/collection/items-get-list-object-page";
  private urlGetMyFavourites = "main/collection/favorites";
  private urlGetMyItems = "main/collection/my-items";

  // all admin related APIs
  private urlGetImages = "main/image/get-list-object-page";
  private urlAddImage = "main/image/add";
  private urlAddPart = "main/image/part/add";
  private urlAddVariation = "main/image/part/variation/add";
  private urlAddCategory = "main/category/add";
  private urlGetCategories = "main/category/get-list";
  private urlAddSubCategory = "main/category/sub-category/add";
  private urlGetSubCategories = "main/category/sub-category/get-list";
  private urlAddMetadataKey = "main/metadata/add";
  private urlGetMetadataList = "main/metadata/get-list";
  private urlUpdatePartOrder = "main/image/part-order";
  private urlGenerate = "main/image/generate";
  private urlGetListItemInCollection =
    "main/collection/items-get-list-object-page";
  private urlGetCollectionListForImage = "main/collection/get";
  private urlGetCollections = "main/collection/get-list-object-page";
  private urlUpdateReleaseDate = "main/collection/release-date";
  private urlGetGenHistory = "main/collection/generate-history";
  private urlGetVariantRarity = "main/collection/variation/report";
  private urlGetItemsByVariant = "main/collection/item/by-variations";
  private urlDeleteImage = "main/image/delete";
  private urlDeletePart = "main/image/part/delete";
  private urlDeleteVariant = "main/image/part/variation/delete";
  private urlGetItemRatity = "main/collection/item/variations";
  private urlDeleteCategory = "main/category/delete";
  private urlDeleteSubCategory = "main/category/sub-category/delete";
  private urlDeleteMetadata = "main/metadata/delete";
  private urlUpdateCategory = "main/category/update";
  private urlUpdateSubCategory = "main/category/sub-category/update";
  private urlUpdateMetadataKey =  "main/metadata/update";
  private urlAddImageConstraint = 'main/image-constraint/add';
  private urlGetImageConstraint = 'main/image-constraint/get-list-object';
  private urlDeleteImageConstraint = 'main/image-constraint/delete';

  constructor(apiService: ApiService, dataService: DataService) {
    super(apiService, dataService);
  }

  objectParentKey(): string {
    return "";
  }

  objectPrimaryKey(): string {
    return "";
  }

  isCacheable(): boolean {
    return true;
  }

  objectKey(): string {
    return "collection";
  }

  getCollection(params): Observable<any> {
    return this.getListCommon(this.urlGetCollection, params, false, true).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  getItemsInCollection(params): Observable<any> {
    return this.getListCommon(
      this.urlGetItemInCollection,
      params,
      false,
      false
    ).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  getFavourites(params): Observable<any> {
    return this.getListCommon(
      this.urlGetMyFavourites,
      params,
      true,
      false
    ).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  getMyItems(params): Observable<any> {
    return this.getListCommon(this.urlGetMyItems, params, true, false).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  getImages(params): Observable<any> {
    return this.getListCommon(this.urlGetImages, params, false, false).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  addImage(params, file: File): Observable<any> {
    return this.uploadFile(file, this.urlAddImage, params, "image_json").pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  addPart(params, file: File): Observable<any> {
    return this.uploadFile(file, this.urlAddPart, params, "part_json").pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  addVariation(params, file: File, file1: File): Observable<any> {
    if (file1 == undefined || file1 == null) {
      return this.uploadFile(
        file,
        this.urlAddVariation,
        params,
        "variation_json"
      ).pipe(
        map((data) => {
          return data;
        }),
        catchError((ex) => {
          return throwError(ex);
        })
      );
    } else {
      return this.uploadTwoFile(
        file,
        file1,
        "rep_image",
        this.urlAddVariation,
        params,
        "variation_json"
      ).pipe(
        map((data) => {
          return data;
        }),
        catchError((ex) => {
          return throwError(ex);
        })
      );
    }
    
  }

  addCategory(params): Observable<any> {
    return this.postCommon(this.urlAddCategory, params, false).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  getCategoryList(params): Observable<any> {
    return this.getListCommon(this.urlGetCategories, params, false, false).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  addSubCategory(params): Observable<any> {
    return this.postCommon(this.urlAddSubCategory, params, false).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  getSubCategoryByCategory(params): Observable<any> {
    return this.getListCommon(
      this.urlGetSubCategories,
      params,
      false,
      false
    ).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  addMetadataKey(params): Observable<any> {
    return this.postCommon(this.urlAddMetadataKey, params, false).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  updatePartOrder(params): Observable<any> {
    return this.updatePart(this.urlUpdatePartOrder, params, "part_order").pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  getMetadataList(params): Observable<any> {
    return this.getListCommon(
      this.urlGetMetadataList,
      params,
      false,
      false
    ).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  generateCollection(params): Observable<any> {
    return this.generate(this.urlGenerate, params, "generate_json").pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  getCollectListForImage(params): Observable<any> {
    return this.getListCommon(
      this.urlGetCollectionListForImage,
      params,
      false,
      false
    ).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  getCollections(params): Observable<any> {
    return this.getListCommon(
      this.urlGetCollections,
      params,
      false,
      false
    ).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  getGenHistory(params): Observable<any> {
    return this.getListCommon(this.urlGetGenHistory, params, false, false).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  getVariantRarity(params): Observable<any> {
    return this.getListCommon(
      this.urlGetVariantRarity,
      params,
      false,
      false
    ).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  updateRelaseDate(params): Observable<any> {
    return this.postCommon(this.urlUpdateReleaseDate, params, false).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  deleteImage(params): Observable<any> {
    return this.postCommon(this.urlDeleteImage, params, false).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  deletePart(params): Observable<any> {
    return this.postCommon(this.urlDeletePart, params, false).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  deleteVariation(params): Observable<any> {
    return this.postCommon(this.urlDeleteVariant, params, false).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }


  getItemsByVariant(params): Observable<any> {
    return this.getListCommon(
      this.urlGetItemsByVariant,
      params,
      false,
      false
    ).pipe(
      map((data) => {
        return data;
      }),
      catchError((ex) => {
        return throwError(ex);
      })
    );
  }

  getItemsRarity(params): Observable<any> {
    return this.getListCommon(
        this.urlGetItemRatity,
        params,
        false,
        false
    ).pipe(
        map((data) => {
          return data;
        }),
        catchError((ex) => {
          return throwError(ex);
        })
    );
  }

  deleteCategory(params): Observable<any> {
    return this.postCommon(this.urlDeleteCategory, params, false).pipe(
        map((data) => {
          return data;
        }),
        catchError((ex) => {
          return throwError(ex);
        })
    );
  }

  deleteSubCategory(params): Observable<any> {
    return this.postCommon(this.urlDeleteSubCategory, params, false).pipe(
        map((data) => {
          return data;
        }),
        catchError((ex) => {
          return throwError(ex);
        })
    );
  }

  deleteMetadata(params): Observable<any> {
    return this.postCommon(this.urlDeleteMetadata, params, false).pipe(
        map((data) => {
          return data;
        }),
        catchError((ex) => {
          return throwError(ex);
        })
    );
  }

  updateCategory(params): Observable<any> {
    return this.postCommon(this.urlUpdateCategory, params, false).pipe(
        map((data) => {
          return data;
        }),
        catchError((ex) => {
          return throwError(ex);
        })
    );
  }

  updateSubCategory(params): Observable<any> {
    return this.postCommon(this.urlUpdateSubCategory, params, false).pipe(
        map((data) => {
          return data;
        }),
        catchError((ex) => {
          return throwError(ex);
        })
    );
  }

  updateMetadataKey(params): Observable<any> {
    return this.postCommon(this.urlUpdateMetadataKey, params, false).pipe(
        map((data) => {
          return data;
        }),
        catchError((ex) => {
          return throwError(ex);
        })
    );
  }

  addImageConstraint(params): Observable<any> {
    return this.postCommon(this.urlAddImageConstraint, params, false).pipe(
        map((data) => {
          return data;
        }),
        catchError((ex) => {
          return throwError(ex);
        })
    );
  }

  getImageConstraint(params): Observable<any> {
    return this.getListCommon(this.urlGetImageConstraint, params, true, false).pipe(
        map((data) => {
          return data;
        }),
        catchError((ex) => {
          return throwError(ex);
        })
    );
  }

  deleteImageConstraint(params): Observable<any> {
    return this.postCommon(this.urlDeleteImageConstraint, params, false).pipe(
        map((data) => {
          return data;
        }),
        catchError((ex) => {
          return throwError(ex);
        })
    );
  }


}
