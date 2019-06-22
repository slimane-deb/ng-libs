import { ListingHeader, ListingDeco } from 'projects/dynamic-listing/src/public-api';


@ListingHeader({
  title : 'test listing',
  url : new URL('http://lab-app:82/achatR18-test/api/dossier/listeDossier?idPlan=2019'),
  searchRow : true,
  resizeColomns : true,
  globalSearch : true,
})
export class TestListing {

  @ListingDeco({
    label : 'N° Dossier',
    width : 200,
  })
  id;

  @ListingDeco({
    label : 'LIBELLE'
  })
  libelle;

  @ListingDeco({
    label : 'NATURE'
  })
  libNature;

  @ListingDeco({
    label : 'DATE CREATION'
  })
  dateCreation;

  @ListingDeco({
    label : 'Type',
    value : "typeDossier  -> libelle"
  })
  typeDossier;

  @ListingDeco({
    label : 'Groupe',
    value : "groupe->libelle",
    href : "go?groupid={groupe -> id}&typid={id}&id={personne->id}",
  })
  groupe;

  @ListingDeco({
    label : 'Etat',
    value : "situation->libelle"
  })
  situation;

  @ListingDeco({
    label : 'Charger du dossier'
  })
  personne;
}

